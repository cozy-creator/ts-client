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
  GenerateParams,
  GenerationResponse,
} from '../models/index';
import {
    GenerateParamsFromJSON,
    GenerateParamsToJSON,
    GenerationResponseFromJSON,
    GenerationResponseToJSON,
} from '../models/index';

export interface GenerateRequest {
    generateParams: GenerateParams;
}

export interface GenerateAsyncRequest {
    generateParams: GenerateParams;
}

/**
 * 
 */
export class GenerationApi extends runtime.BaseAPI {

    /**
     * This endpoint initiates the generation process and streams the response as data is generated.
     * Initiates synchronous generation of content with a streaming response
     */
    async generateRaw(requestParameters: GenerateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GenerationResponse>> {
        if (requestParameters['generateParams'] == null) {
            throw new runtime.RequiredError(
                'generateParams',
                'Required parameter "generateParams" was null or undefined when calling generate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/generate`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GenerateParamsToJSON(requestParameters['generateParams']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GenerationResponseFromJSON(jsonValue));
    }

    /**
     * This endpoint initiates the generation process and streams the response as data is generated.
     * Initiates synchronous generation of content with a streaming response
     */
    async generate(requestParameters: GenerateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GenerationResponse> {
        const response = await this.generateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * This endpoint triggers the async generation process with specified parameters.
     * Initiates asynchronous generation of content
     */
    async generateAsyncRaw(requestParameters: GenerateAsyncRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GenerationResponse>> {
        if (requestParameters['generateParams'] == null) {
            throw new runtime.RequiredError(
                'generateParams',
                'Required parameter "generateParams" was null or undefined when calling generateAsync().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // APIKeyHeader authentication
        }

        const response = await this.request({
            path: `/generate_async`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GenerateParamsToJSON(requestParameters['generateParams']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GenerationResponseFromJSON(jsonValue));
    }

    /**
     * This endpoint triggers the async generation process with specified parameters.
     * Initiates asynchronous generation of content
     */
    async generateAsync(requestParameters: GenerateAsyncRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GenerationResponse> {
        const response = await this.generateAsyncRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
