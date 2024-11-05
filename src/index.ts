import * as msgpack from "@msgpack/msgpack";
// import * as FormData from "form-data";

import { Readable } from "stream";
import { FileEndpoint } from "./endpoints/file";
import { WorkflowEndpoint } from "./endpoints/workflow";
import { GenerationEndpoint } from "./endpoints/generation";

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
  public generation: GenerationEndpoint;

  constructor(options: Options = {}) {
    const apiKey = options.apiKey || process.env.COZY_API_KEY;
    if (!apiKey) {
      throw new Error(
        "API key is required. Set it in options or in COZY_API_KEY environment variable."
      );
    }

    this._apiKey = apiKey;
    this._baseUrl = options.baseUrl || "https://api.cozy.art/v1";

    this._defaultHeaders = new Headers(options.headers);
    if (!this._defaultHeaders.has("X-API-Key")) {
      this._defaultHeaders.set("X-API-Key", this._apiKey);
    }

    this.file = new FileEndpoint(this);
    this.workflow = new WorkflowEndpoint(this);
    this.generation = new GenerationEndpoint(this);
  }

  _prepareHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    for (const [key, value] of this._defaultHeaders.entries()) {
      headers.set(key, value);
    }

    headers["Accept"] = headers["Accept"] || "application/json";
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    return headers;
  }

  async _serializeData(
    data: any,
    contentType: string
  ): Promise<Uint8Array | string> {
    if (MSG_PACK_HEADERS.includes(contentType)) {
      if (data instanceof Uint8Array) {
        return data;
      }

      return msgpack.encode(data);
    }

    if (typeof data === "object") {
      return JSON.stringify(data);
    }
    return data;
  }

  async _handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    if (contentType.includes("application/json")) {
      return await response.json();
    } else if (contentType.includes("application/vnd.msgpack")) {
      const buffer = await response.arrayBuffer();
      return msgpack.decode(new Uint8Array(buffer)) as T;
    }
    // else if (contentType.includes("application/octet-stream")) {
    //   // Handle streaming output as an async iterable
    //   const stream = response.body;
    //   if (!stream) {
    //     throw new Error("Response body is null");
    //   }
    //   return stream as unknown as T;
    // }
    else {
      throw new Error(`Unsupported response Content-Type: ${contentType}`);
    }
  }

  public get baseUrl() {
    return this._baseUrl;
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
