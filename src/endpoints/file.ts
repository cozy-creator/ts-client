import { CozyCreator } from "..";
import { RequestOptions, UploadResponse } from "../types";
import { mergeHeaders } from "../utils";
import * as FormData from "form-data";

export class FileEndpoint {
  private api: CozyCreator;

  constructor(api: CozyCreator) {
    this.api = api;
  }

  /**
   * Uploads a file to the server.
   */
  async uploadFile(
    file: Buffer | Blob | File | ReadableStream<Uint8Array> | string,
    options: RequestOptions = {}
  ): Promise<UploadResponse> {
    const url = `${this.api.baseUrl}/upload`;

    const formData = new FormData();
    formData.append("file", file);

    const headers = mergeHeaders(
      this.api.defaultHeaders,
      new Headers(options.headers),
      new Headers(formData.getHeaders())
    );

    const response = await fetch(url, {
      body: formData as any,
      method: "POST",
      headers,
    });

    return this.api._handleResponse<UploadResponse>(response);
  }
}
