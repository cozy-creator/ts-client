import { encode, decode } from "msgpackr";
import { FileEndpoint } from "./endpoints/file";
import { WorkflowEndpoint } from "./endpoints/workflow";
import { Text2MediaEndpoint } from "./endpoints/text2Media";
import { mergeHeaders, throwResponseError } from "./utils";
import { jobEvent } from "./schema";
import { JobEvent } from "./types";

interface Options {
  apiKey?: string;
  baseUrl?: string;
  headers?: HeadersInit;
}

const MSG_PACK_HEADERS = [
  "application/msgpack",
  "application/x-msgpack",
  "application/vnd.msgpack",
];

export class CozyCreator {
  private _apiKey: string;
  private _baseUrl: string;
  private _defaultHeaders: Headers;

  public file: FileEndpoint;
  public workflow: WorkflowEndpoint;
  public text2Media: Text2MediaEndpoint;

  constructor(options: Options = {}) {
    const apiKey = options.apiKey || process.env.COZY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "API key is required. Set it in options or in COZY_API_KEY environment variable."
      );
    }

    this._apiKey = apiKey;
    this._baseUrl = this._normalizeUrl(
      options.baseUrl || "https://api.cozy.art"
    );

    this._defaultHeaders = new Headers(options.headers);
    if (!this._defaultHeaders.has("X-API-Key")) {
      this._defaultHeaders.set("X-API-Key", this._apiKey);
    }

    this.file = new FileEndpoint(this);
    this.workflow = new WorkflowEndpoint(this);
    this.text2Media = new Text2MediaEndpoint(this);
  }

  private _normalizeUrl(url: string): string {
    // Ensure protocol is specified
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Remove trailing slashes
    url = url.replace(/\/+$/, "");

    return url;
}

  _prepareHeaders(customHeaders?: HeadersInit): Headers {
    const headers = mergeHeaders(
      new Headers(customHeaders),
      this._defaultHeaders
    );

    const accept = headers.get("Accept") || "application/json";
    const contentType = headers.get("Content-Type") || "application/json";

    headers.set("Accept", accept);
    headers.set("Content-Type", contentType);
    return headers;
  }

  async _serializeData(
    data: any,
    contentType = this.defaultHeaders.get("Content-Type")
  ): Promise<Uint8Array | string> {
    if (MSG_PACK_HEADERS.includes(contentType!)) {
      if (data instanceof Uint8Array) {
        return data;
      }

      return encode(data);
    }

    if (typeof data === "object") {
      return JSON.stringify(data);
    }
    return data;
  }

  async _handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      await throwResponseError(response);
    }

    if (contentType.includes("application/json")) {
      return await response.json();
    } else if (contentType.includes("application/vnd.msgpack")) {
      const buffer = await response.arrayBuffer();
      return decode(new Uint8Array(buffer)) as T;
    } else {
      throw new Error(`Unsupported response Content-Type: ${contentType}`);
    }
  }

    /**
   * Internal method to handle streaming responses.
   */
  async *_streamEvents(
    url: string,
    init: RequestInit
  ): AsyncGenerator<JobEvent> {
    const response = await fetch(url, init);

    if (!response.ok) {
      await throwResponseError(response);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const acceptHeader =
      (init.headers instanceof Headers && init.headers.get("Accept")) ||
      "application/vnd.msgpack";

    const reader = response.body.getReader();

    try {
      if (acceptHeader.includes("text/event-stream")) {
        yield* this._handleSSEStream(reader);
      } else if (acceptHeader?.includes("msgpack")) {
        yield* this._handleMsgPackStream(reader);
      } else {
        throw new Error(`Unsupported Accept header: ${acceptHeader}`);
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Handle Server-Sent Events stream
   */
  private async *_handleSSEStream(
    reader: ReadableStreamDefaultReader<Uint8Array>
  ): AsyncGenerator<JobEvent> {
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            yield JSON.parse(data);
          } catch (e) {
            console.warn("Failed to parse SSE data:", e);
          }
        }
      }
    }
  }

  /**
   * Handle MessagePack stream
   */
  private async *_handleMsgPackStream(
    reader: ReadableStreamDefaultReader<Uint8Array>
  ): AsyncGenerator<JobEvent> {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      try {
        if (done) break;
        const decoded = decode(value);
        yield jobEvent.parse(decoded);
      } catch (e) {
        console.warn("Failed to parse msgpack data:", e);
      }
    }
  }

  public get baseUrl() {
    return this._baseUrl;
  }

  public get version() {
    return "/v1";
  }

  public get defaultHeaders() {
    return this._defaultHeaders;
  }

  public get apiKey() {
    return this._apiKey;
  }
}

function isAsyncIterable(obj: any): obj is AsyncIterable<any> {
  return obj && typeof obj[Symbol.asyncIterator] === "function";
}

async function* asyncIterableToStream(iterable: AsyncIterable<any>) {
  for await (const chunk of iterable) {
    yield chunk;
  }
}

// Re-export types for consumers of our library
export type * from "./types";
export * from "./validators";
