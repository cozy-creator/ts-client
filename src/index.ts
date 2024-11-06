import { encode, decode } from "msgpackr";
import { FileEndpoint } from "./endpoints/file";
import { WorkflowEndpoint } from "./endpoints/workflow";
import { Text2ImageEndpoint } from "./endpoints/text2Image";
import { mergeHeaders } from "./utils";

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
  public text2Image: Text2ImageEndpoint;

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
    this.text2Image = new Text2ImageEndpoint(this);
    this.workflow = new WorkflowEndpoint(this);
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
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
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

// Re-export types for consumers of our library
export type * from "./types";
export * from "./validators";
