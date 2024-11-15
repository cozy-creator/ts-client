import {
  JobStatusResponse,
  Text2MediaResult,
  JobEvent,
  Text2MediaRequest,
  RequestOptions,
} from "../types";
import { CozyCreator } from "..";
import { mergeHeaders } from "../utils";
import { decode } from "msgpackr";
import { jobEvent } from "../schema";

export class Text2MediaEndpoint {
  private api: CozyCreator;

  constructor(api: CozyCreator) {
    this.api = api;
  }

  /**
   * Submits a new job to generate media.
   */
  async submit(
    jobRequest: Text2MediaRequest,
    options: RequestOptions = {}
  ): Promise<JobStatusResponse> {
    const url = `${this.api.baseUrl}/jobs/submit`;
    const headers = this.api._prepareHeaders(options.headers);

    const body = await this.api._serializeData(
      jobRequest,
      headers.get("Content-Type")!
    );
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body as any,
    });

    return this.api._handleResponse<JobStatusResponse>(response);
  }

  /**
   * Retrieves the current status of a job.
   */
  async getStatus(
    id: string,
    options: RequestOptions = {}
  ): Promise<JobStatusResponse> {
    const url = `${this.api.baseUrl}/jobs/${id}/status`;
    const headers = this.api._prepareHeaders(options.headers);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return this.api._handleResponse<JobStatusResponse>(response);
  }

  /**
   * Retrieves the completed image result of a job.
   */
  async getJob(
    id: string,
    options: RequestOptions = {}
  ): Promise<Text2MediaResult> {
    const url = `${this.api.baseUrl}/jobs/${id}`;
    const headers = this.api._prepareHeaders(options.headers);

    const response = await fetch(url, { method: "GET", headers });
    return (
      await this.api._handleResponse<{ data: Text2MediaResult }>(response)
    ).data;
  }

  /**
   * Streams events for a specific job.
   */
  async *streamEvents(
    id: string,
    options: RequestOptions = {}
  ): AsyncGenerator<JobEvent> {
    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers)
    );

    // Set default Accept header if not provided
    if (!headers.get("Accept")) {
      headers.set("Accept", "application/vnd.msgpack");
    }

    const url = `${this.api.baseUrl}/jobs/${id}/stream`;
    yield* this._streamEvents(url, {
      method: "GET",
      headers,
    });
  }

  /**
   * Submits a job and streams its events.
   */
  async *submitAndStreamEvents(
    request: Text2MediaRequest,
    options: RequestOptions = {}
  ): AsyncGenerator<JobEvent> {
    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers)
    );

    // Set defaults if not provided
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/vnd.msgpack");
    }
    if (!headers.get("Accept")) {
      headers.set("Accept", "application/vnd.msgpack");
    }

    const url = `${this.api.baseUrl}/jobs/stream`;
    const body = await this.api._serializeData(
      request,
      headers.get("Content-Type")
    );

    yield* this._streamEvents(url, {
      method: "POST",
      headers,
      body,
    });
  }

  /**
   * Internal method to handle streaming responses.
   */
  private async *_streamEvents(
    url: string,
    init: RequestInit
  ): AsyncGenerator<JobEvent> {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
}
