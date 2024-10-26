/* tslint:disable */
/* eslint-disable */
/**
 * Cozy Creator
 * Cozy Creator OpenAPI specification
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  UploadResponse,
} from '../models/index';
import {
    UploadResponseFromJSON,
    UploadResponseToJSON,
} from '../models/index';

export interface UploadFileRequest {
    file?: Blob;
}

/**
 * 
 */
export class FileApi extends runtime.BaseAPI {

    /**
     * This endpoint uploads a file using a form-data request with the key `file`.
     * Uploads a file to the server
     */
    async uploadFileRaw(requestParameters: UploadFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UploadResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['file'] != null) {
            formParams.append('file', requestParameters['file'] as any);
        }

        const response = await this.request({
            path: `/upload`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadResponseFromJSON(jsonValue));
    }

    /**
     * This endpoint uploads a file using a form-data request with the key `file`.
     * Uploads a file to the server
     */
    async uploadFile(requestParameters: UploadFileRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UploadResponse> {
        const response = await this.uploadFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
