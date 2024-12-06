import {
  JobStatusResponse,
  Text2MediaResult,
  JobEvent,
  Text2MediaRequest,
  RequestOptions,
} from "../types";
import { CozyCreator } from "..";
import { mergeHeaders, throwResponseError } from "../utils";
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
    const url = `${this.api.baseUrl}${this.api.version}/jobs/submit`;
    const headers = this.api._prepareHeaders(options.headers);

    const body = await this.api._serializeData(
      jobRequest,
      headers.get("Content-Type")!
    );
    const response = await fetch(url, {
      ...options,
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
    const url = `${this.api.baseUrl}${this.api.version}/jobs/${id}/status`;
    const headers = this.api._prepareHeaders(options.headers);

    const response = await fetch(url, {
      ...options,
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
    const url = `${this.api.baseUrl}${this.api.version}/jobs/${id}`;
    const headers = this.api._prepareHeaders(options.headers);

    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers,
    });
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

    const url = `${this.api.baseUrl}${this.api.version}/jobs/${id}/stream`;
    yield* this.api._streamEvents(url, {
      ...options,
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

    const url = `${this.api.baseUrl}${this.api.version}/jobs/stream`;
    const body = await this.api._serializeData(
      request,
      headers.get("Content-Type")
    );

    yield* this.api._streamEvents(url, {
      ...options,
      method: "POST",
      headers,
      body,
    });
  }
}
