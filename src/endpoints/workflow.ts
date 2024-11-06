import { CozyCreator } from "..";
import {
  Workflow,
  RequestOptions,
  WorkflowOutput,
  WorkflowResponse,
  EventSourceInitDict,
} from "../types";
import { mergeHeaders } from "../utils";

export class WorkflowEndpoint {
  private api: CozyCreator;

  constructor(api: CozyCreator) {
    this.api = api;
  }

  /**
   * Executes a workflow.
   */
  async executeWorkflow(
    workflow: Workflow,
    options: RequestOptions = {}
  ): Promise<WorkflowResponse> {
    const url = `${this.api.baseUrl}/workflow/execute`;
    const headers = this.api._prepareHeaders(options.headers);

    const body = await this.api._serializeData(
      workflow,
      headers.get("Content-Type")
    );
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body as any,
    });

    return this.api._handleResponse<WorkflowResponse>(response);
  }

  /**
   * Streams the workflow output for the given workflow ID.
   */
  async *streamWorkflow(
    id: string,
    options: RequestOptions = {}
  ): AsyncGenerator<WorkflowOutput> {
    const url = `${this.api.baseUrl}/workflow/${encodeURIComponent(id)}/stream`;
    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers)
    );

    headers.set("Accept", "text/event-stream");
    yield* this._eventSourceGenerator<WorkflowOutput>(url, headers);
  }

  /**
   * Internal method to create an AsyncGenerator from an EventSource.
   */
  private async *_eventSourceGenerator<T>(
    url: string,
    headers: Headers
  ): AsyncGenerator<T> {
    const eventSourceInitDict: EventSourceInitDict = {
      headers,
      rejectUnauthorized: true,
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
}
