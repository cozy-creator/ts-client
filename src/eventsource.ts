import { Decoder, encode } from "@msgpack/msgpack";

class MessageEvent extends Event {
  data?: any = "";
  lastEventId?: string = "";

  constructor(type: string, options: MessageEventInit = {}) {
    super(type);
    this.data = options.data || "";
    this.lastEventId = options.lastEventId || "";
  }
}

type EventType = "open" | "message" | "error";

export interface EventSourceInitDict {
  rejectUnauthorized?: boolean;
  withCredentials?: boolean;
  headers?: HeadersInit;
  method?: string;
  retry?: number;
  body?: any;
}

interface MessageEventListener {
  (evt: MessageEvent): void;
}

export class EventSource {
  body: any;
  url: string;
  retry: number;
  method: string;
  readyState: number;
  headers: Headers;
  withCredentials: boolean;

  onerror: EventListener | null;
  onopen: EventListener | null;
  onmessage: MessageEventListener | null;

  private _listeners: { [type: string]: EventListener[] };
  private _controller: AbortController | null;
  private _lastEventId: string;
  private _retryTimeout: NodeJS.Timeout | null;
  private _data?: any;
  private _eventName?: string;

  constructor(url: string, eventSourceInitDict: EventSourceInitDict = {}) {
    this.url = url;
    this.readyState = EventSource.CONNECTING;

    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;

    this._listeners = {};

    this.withCredentials = !!eventSourceInitDict.withCredentials;
    this.method = eventSourceInitDict.method || "GET";
    this.body = eventSourceInitDict.body || null;
    this.retry = eventSourceInitDict.retry || 1000;
    this.headers = new Headers(eventSourceInitDict.headers);

    this._controller = null;
    this._lastEventId = "";
    this._retryTimeout = null;

    this._connect();
  }

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  close(): void {
    this.readyState = EventSource.CLOSED;
    if (this._controller) {
      this._controller.abort();
      this._controller = null;
    }

    if (this._retryTimeout) {
      clearTimeout(this._retryTimeout);
      this._retryTimeout = null;
    }
  }

  addEventListener(type: string, listener: EventListener): void {
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    if (!this._listeners[type]) return;
    const index = this._listeners[type].indexOf(listener);
    if (index !== -1) {
      this._listeners[type].splice(index, 1);
    }
  }

  dispatchEvent(event: Event | MessageEvent): void {
    const listeners = this._listeners[event.type];
    if (listeners) {
      for (const listener of listeners) {
        listener.call(this, event);
      }
    }

    const evt = ("on" + event.type) as `on${EventType}`;
    const handler = this[evt] as EventListener | MessageEventListener | null;
    handler?.call(this, event);
  }

  // Internal method to start the connection
  private _connect(): void {
    if (this.readyState === EventSource.CLOSED) return;

    this.readyState = EventSource.CONNECTING;

    this._controller = new AbortController();
    const signal = this._controller.signal;

    const headers = new Headers(this.headers);
    headers.set("Accept", "text/event-stream");
    if (this._lastEventId) {
      headers.set("Last-Event-ID", this._lastEventId);
    }

    const options: RequestInit = {
      method: this.method,
      headers,
      signal,
    };

    // Handle MessagePack content-type for request
    const contentType =
      headers.get("Content-Type") || headers.get("content-type") || "";
    if (this.method === "POST" && this.body) {
      if (contentType === "application/msgpack") {
        // If body is not packed, pack it
        if (!(this.body instanceof Uint8Array)) {
          options.body = encode(this.body);
        } else {
          options.body = this.body;
        }
      } else {
        options.body = this.body;
      }
    }

    if (this.withCredentials) {
      options.credentials = "include";
    }

    fetch(this.url, options)
      .then((response: Response) => {
        const contentType = this.headers.get("Content-Type") ?? "";
        const msgPackHeaders = [
          "application/msgpack",
          "application/x-msgpack",
          "application/vnd.msgpack",
        ];

        if (response.ok) {
          if (contentType == "text/event-stream") {
            this.readyState = EventSource.OPEN;
            this.dispatchEvent(new Event("open"));
            this._parseEventStream(response.body, false);
          } else if (msgPackHeaders.includes(contentType)) {
            this.readyState = EventSource.OPEN;
            this.dispatchEvent(new Event("open"));
            this._parseEventStream(response.body, true);
          } else {
            this.dispatchEvent(new Event("error"));
            this._reconnect();
          }
        } else {
          this.dispatchEvent(new Event("error"));
          this._reconnect();
        }
      })
      .catch((error: any) => {
        this.dispatchEvent(new Event("error"));
        this._reconnect();
      });
  }

  private _parseEventStream(
    stream: ReadableStream<Uint8Array> | null,
    isMsgPack: boolean = false
  ): void {
    if (!stream) return;

    if (isMsgPack) {
      const decoder = new Decoder();
      const asyncIterable = this._readableStreamToAsyncIterable(stream);

      const processStream = async () => {
        try {
          const decodedStream = decoder.decodeStream(asyncIterable);
          for await (const decodedValue of decodedStream) {
            this._handleDecodedMessage(decodedValue);
          }
        } catch (error) {
          console.error("Failed to decode MessagePack data", error);
          this.dispatchEvent(new Event("error"));
          this._reconnect();
        }
      };
      processStream();
    } else {
      // existing code for text/event-stream
      const textDecoder = new TextDecoder("utf-8");
      let buffer = "";

      const processStream = async () => {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += textDecoder.decode(value, { stream: true });
            this._processBuffer(buffer);
          }
        } catch (error) {
          console.error("Read error", error);
          this.dispatchEvent(new Event("error"));
          this._reconnect();
        } finally {
          reader.releaseLock();
        }
      };
      processStream();
    }
  }

  private _readableStreamToAsyncIterable(
    stream: ReadableStream<Uint8Array>
  ): AsyncIterable<Uint8Array> {
    const reader = stream.getReader();
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const { value, done } = await reader.read();
            if (done) {
              reader.releaseLock();
              return { value: undefined, done: true };
            }
            return { value, done: false };
          },
        };
      },
    };
  }

  private _handleDecodedMessage(decodedValue: any) {
    const eventData = decodedValue;

    console.log("decodedValue: ", decodedValue, eventData);
    const eventType = eventData.event || eventData.type || "message";
    console.log("eventType: ", eventType);

    if (eventData.id) {
      this._lastEventId = eventData.id;
    }
    if (eventData.retry) {
      const retry = parseInt(eventData.retry, 10);
      if (!isNaN(retry)) {
        this.retry = retry;
      }
    }
    const event = new MessageEvent(eventType, {
      data: eventData.data,
      lastEventId: this._lastEventId,
    });

    console.log("event: ", event);
    this.dispatchEvent(event);
  }

  private _processBuffer(buffer: string): void {
    let position = 0;
    let length = buffer.length;

    while (position < length) {
      let lineEnd = buffer.indexOf("\n", position);
      if (lineEnd === -1) {
        break;
      }

      let line = buffer.slice(position, lineEnd);
      if (line.endsWith("\r")) {
        line = line.slice(0, -1);
      }
      position = lineEnd + 1;

      if (line === "") {
        // Dispatch the event
        this._dispatchEvent();
      } else if (line.startsWith(":")) {
        // Comment line, ignore
      } else {
        const colonIndex = line.indexOf(":");
        let field: string, value: string;
        if (colonIndex === -1) {
          field = line;
          value = "";
        } else {
          field = line.slice(0, colonIndex);
          value = line.slice(colonIndex + 1).trimStart();
        }
        this._processField(field, value);
      }
    }
    buffer = buffer.slice(position);
  }

  private _processField(field: string, value: string): void {
    switch (field) {
      case "data":
        if (this._data === undefined) {
          this._data = value + "\n";
        } else {
          this._data += value + "\n";
        }
        break;
      case "id":
        this._lastEventId = value;
        break;
      case "event":
        this._eventName = value;
        break;
      case "retry":
        const retry = parseInt(value, 10);
        if (!isNaN(retry)) {
          this.retry = retry;
        }
        break;
    }
  }

  private _dispatchEvent(): void {
    if (this._data === undefined) {
      return;
    }
    const eventType = this._eventName || "message";
    const event = new MessageEvent(eventType, {
      data: this._data.slice(0, -1),
      lastEventId: this._lastEventId,
    });
    this.dispatchEvent(event);
    this._data = undefined;
    this._eventName = undefined;
  }

  private _reconnect(): void {
    if (this.readyState === EventSource.CLOSED) return;

    this.readyState = EventSource.CONNECTING;

    if (this._controller) {
      this._controller.abort();
      this._controller = null;
    }

    this._retryTimeout = setTimeout(() => {
      this._connect();
    }, this.retry);
  }
}
