import { Readable } from "stream";
import { EventSourceInitDict } from "../eventsource";
import {
  JobStatusResponse,
  JobResult,
  JobStreamEvent,
  JobRequest,
  RequestOptions,
} from "../types";
import { CozyCreator } from "..";
import { mergeHeaders } from "../utils";

export class GenerationEndpoint {
  private api: CozyCreator;

  constructor(api: CozyCreator) {
    this.api = api;
  }

  /**
   * Submits a new job to generate images.
   */
  async submitJob(
    jobRequest: JobRequest,
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
  async getJobStatus(
    jobId: string,
    options: RequestOptions = {}
  ): Promise<JobStatusResponse> {
    const url = `${this.api.baseUrl}/jobs/${encodeURIComponent(jobId)}/status`;
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
  async getJobResult(
    jobId: string,
    options: RequestOptions = {}
  ): Promise<JobResult | AsyncIterable<JobResult>> {
    const url = `${this.api.baseUrl}/jobs/${encodeURIComponent(jobId)}/result`;
    const headers = this.api._prepareHeaders(options.headers);

    const response = await fetch(url, { method: "GET", headers });
    return this.api._handleResponse<JobResult>(response);
  }

  /**
   * Streams events for a specific job.
   */
  async *streamJobEvents(
    id: string,
    options: RequestOptions = {}
  ): AsyncGenerator<JobStreamEvent | Event> {
    const url = `${this.api.baseUrl}/jobs/${id}/stream-events`;
    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers)
    );

    headers.set("Accept", "text/event-stream");
    yield* this._eventSourceGenerator<JobStreamEvent>(url, headers);
  }

  /**
   * Submits a job and streams its events.
   */
  async *submitAndStreamJob(
    jobRequest: JobRequest,
    options: RequestOptions = {}
  ): AsyncGenerator<JobStreamEvent | Event> {
    const url = `${this.api.baseUrl}/jobs/stream`;
    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers)
    );

    headers.set("Accept", "text/event-stream");
    headers.set("Content-Type", headers["Content-Type"] || "application/json");
    const body = await this.api._serializeData(
      jobRequest,
      headers["Content-Type"]
    );

    yield* this._eventSourceGenerator<JobStreamEvent>(
      url,
      headers,
      "POST",
      body
    );
  }

  /**
   * Internal method to create an AsyncGenerator from an EventSource.
   */
  private async *_eventSourceGenerator<T>(
    url: string,
    headers: Headers,
    method: string = "GET",
    body?: any
  ): AsyncGenerator<T | Event> {
    const eventSourceInitDict: EventSourceInitDict = {
      rejectUnauthorized: true,
      headers,
      method,
      body,
    };

    const eventSource = new EventSource(url, eventSourceInitDict);

    const queue: (T | Event)[] = [];
    let isClosed = false;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as T;
      queue.push(data);
    };

    eventSource.onerror = (err) => {
      queue.push(err);
      isClosed = true;
      eventSource.close();
    };

    while (!isClosed || queue.length > 0) {
      if (queue.length > 0) {
        const item = queue.shift()!;
        yield item;
        if (item instanceof ErrorEvent) {
          break;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Parses a JSON streaming response into an AsyncIterable.
   */
  private async *_parseJSONStream(
    stream: NodeJS.ReadableStream
  ): AsyncIterable<JobResult> {
    const reader = Readable.from(stream);
    let buffer = "";

    for await (const chunk of reader) {
      buffer += chunk.toString();
      let boundary = buffer.indexOf("\n");
      while (boundary !== -1) {
        const line = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 1);
        if (line.trim()) {
          yield JSON.parse(line);
        }
        boundary = buffer.indexOf("\n");
      }
    }

    if (buffer.trim()) {
      yield JSON.parse(buffer);
    }
  }
}
