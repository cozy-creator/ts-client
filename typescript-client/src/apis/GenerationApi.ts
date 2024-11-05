/* tslint:disable */
/* eslint-disable */
/**
 * Cozy Creator
 * Cozy Creator OpenAPI specification
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  JobRequest,
  JobResult,
  JobStatusResponse,
  JobStreamEvent
} from '../models/index';
import {
    JobRequestFromJSON,
    JobRequestToJSON,
    JobResultFromJSON,
    JobResultToJSON,
    JobStatusResponseFromJSON,
    JobStatusResponseToJSON,
} from '../models/index';
import { encode, decode } from 'msgpackr';

export interface GetJobResultRequest {
    id: string;
    accept?: AcceptEnum;
}

export interface GetJobStatusRequest {
    id: string;
    accept?: AcceptEnum;
}

export interface StreamJobEventsRequest {
    id: string;
    accept?: StreamAcceptEnum;
}

export interface SubmitAndStreamJobRequest {
    contentType?: ContentTypeEnum;
    jobRequest: JobRequest;
    accept?: StreamAcceptEnum;
}

export interface SubmitJobRequest {
    contentType?: ContentTypeEnum;
    jobRequest: JobRequest;
    accept?: AcceptEnum;
}

/**
 * GenerationApi - interface
 * 
 * @export
 * @interface GenerationApiInterface
 */
export interface GenerationApiInterface {
    /**
     * 
     * @summary Retrieve the completed image result of a job
     * @param {string} id The job ID
     * @param {'application/json' | 'application/vnd.msgpack' | 'application/x-msgpack'} [accept] Format the client wants to receive (defaults to JSON)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerationApiInterface
     */
    getJobResultRaw(requestParameters: GetJobResultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobResult>>;

    /**
     * Retrieve the completed image result of a job
     */
    getJobResult(requestParameters: GetJobResultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobResult>;

    /**
     * 
     * @summary Retrieve the current status of a job
     * @param {string} id The job ID
     * @param {'application/json' | 'application/vnd.msgpack' | 'application/x-msgpack'} [accept] Format the client wants to receive (defaults to JSON)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerationApiInterface
     */
    getJobStatusRaw(requestParameters: GetJobStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobStatusResponse>>;

    /**
     * Retrieve the current status of a job
     */
    getJobStatus(requestParameters: GetJobStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobStatusResponse>;

    /**
     * Get the event-stream produced by a job. Starts the event stream from the beginning.
     * @summary Stream events for a specific job
     * @param {string} id The job ID
     * @param {'text/event-stream' | 'application/vnd.msgpack-stream' | 'application/x-msgpack-stream'} [accept] Format the client wants to receive (defaults to msgpack stream)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerationApiInterface
     */
    streamJobEventsRaw(requestParameters: StreamJobEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent>;

    /**
     * Get the event-stream produced by a job. Starts the event stream from the beginning.
     * Stream events for a specific job
     */
    streamJobEvents(requestParameters: StreamJobEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent>;

    /**
     * Submit a job and also returns an event-stream object (async iterable)
     * @summary Submit a job and stream its events
     * @param {'application/json' | 'application/vnd.msgpack' | 'application/x-msgpack'} contentType Format of the data being sent
     * @param {JobRequest} jobRequest 
     * @param {'text/event-stream' | 'application/vnd.msgpack-stream' | 'application/x-msgpack-stream'} [accept] Format the client wants to receive (defaults to msgpack stream)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerationApiInterface
     */
    submitAndStreamJobRaw(requestParameters: SubmitAndStreamJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent>;

    /**
     * Submit a job and also returns an event-stream object (async iterable)
     * Submit a job and stream its events
     */
    submitAndStreamJob(requestParameters: SubmitAndStreamJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent>;

    /**
     * 
     * @summary Submit a new job to generate images
     * @param {'application/json' | 'application/vnd.msgpack' | 'application/x-msgpack'} contentType Format of the data being sent
     * @param {JobRequest} jobRequest 
     * @param {'application/json' | 'application/vnd.msgpack' | 'application/x-msgpack'} [accept] Format the client wants to receive (defaults to JSON)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GenerationApiInterface
     */
    submitJobRaw(requestParameters: SubmitJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobStatusResponse>>;

    /**
     * Submit a new job to generate images
     */
    submitJob(requestParameters: SubmitJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobStatusResponse>;

}

/**
 * 
 */
export class GenerationApi extends runtime.BaseAPI implements GenerationApiInterface {
    private isMessagePack(contentType: string): boolean {
        return contentType.includes('msgpack');
    }

    private encodeRequestBody(contentType: string, data: any): string | Uint8Array {
        return this.isMessagePack(contentType) ? encode(data) : JSON.stringify(data);
    }

    private createApiResponse(response: Response, acceptHeader: string, transformer?: (data: any) => any): runtime.ApiResponse<any> {
        const contentType = response.headers.get('content-type') || '';
        const isMsgPack = this.isMessagePack(acceptHeader) || this.isMessagePack(contentType);

        if (isMsgPack) {
            return new runtime.MsgpackApiResponse(response, (data) => transformer ? transformer(decode(data)) : decode(data));
        } else {
            return new runtime.JSONApiResponse(response, transformer);
        }
    }

    private async *parseStream(response: Response, acceptHeader: string): AsyncIterableIterator<JobStreamEvent> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is null');
        }

        if (acceptHeader === 'text/event-stream') {
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            yield JSON.parse(data);
                        } catch (e) {
                            console.warn('Failed to parse SSE data:', e);
                        }
                    }
                }
            }
        } else if (this.isMessagePack(acceptHeader)) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                try {
                    const events = decode(value) as JobStreamEvent[];
                    for (const event of events) {
                        yield event;
                    }
                } catch (e) {
                    console.warn('Failed to parse msgpack data:', e);
                }
            }
        } else {
            throw new Error(`Unsupported accept type: ${acceptHeader}`);
        }
    }

    /**
     * Retrieve the completed image result of a job
     */
    async getJobResultRaw(requestParameters: GetJobResultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobResult>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getJobResult().'
            );
        }

        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['accept'] != null) {
            headerParameters['Accept'] = String(requestParameters['accept']);
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const response = await this.request({
            path: `/jobs/{id}/result`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return this.createApiResponse(response, requestParameters['accept'] || '', JobResultFromJSON);
    }

    /**
     * Retrieve the completed image result of a job
     */
    async getJobResult(requestParameters: GetJobResultRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobResult> {
        const response = await this.getJobResultRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve the current status of a job
     */
    async getJobStatusRaw(requestParameters: GetJobStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobStatusResponse>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getJobStatus().'
            );
        }

        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['accept'] != null) {
            headerParameters['Accept'] = String(requestParameters['accept']);
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const response = await this.request({
            path: `/jobs/{id}/status`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return this.createApiResponse(response, requestParameters['accept'] || '', JobStatusResponseFromJSON);
    }

    /**
     * Retrieve the current status of a job
     */
    async getJobStatus(requestParameters: GetJobStatusRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobStatusResponse> {
        const response = await this.getJobStatusRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get the event-stream produced by a job. Starts the event stream from the beginning.
     * Stream events for a specific job
     */
    async *streamJobEventsRaw(
        requestParameters: StreamJobEventsRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): AsyncIterableIterator<JobStreamEvent> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling streamJobEvents().'
            );
        }

        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['accept'] != null) {
            headerParameters['Accept'] = String(requestParameters['accept']);
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const response = await this.request({
            path: `/jobs/{id}/stream-events`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        yield* this.parseStream(response, requestParameters['accept'] || '');
    }

    /**
     * Get the event-stream produced by a job. Starts the event stream from the beginning.
     * Stream events for a specific job
     */
    async *streamJobEvents(requestParameters: StreamJobEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent> {
        yield* this.streamJobEventsRaw(requestParameters, initOverrides);
    }

    /**
     * Submit a job and also returns an event-stream object (async iterable)
     * Submit a job and stream its events
     */
    async *submitAndStreamJobRaw(
        requestParameters: SubmitAndStreamJobRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): AsyncIterableIterator<JobStreamEvent> {
        if (requestParameters['jobRequest'] == null) {
            throw new runtime.RequiredError(
                'jobRequest',
                'Required parameter "jobRequest" was null or undefined when calling submitAndStreamJob().'
            );
        }

        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};

        const contentType = requestParameters['contentType'] || ContentTypeEnum.VndMsgpack;
        const accept = requestParameters['accept'] || contentType;

        if (accept != null) {
            headerParameters['Accept'] = String(accept);
        }

        headerParameters['Content-Type'] = String(contentType);

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const body = this.encodeRequestBody(contentType, requestParameters['jobRequest']);

        const response = await this.request({
            path: `/jobs/submit-and-stream-events`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: body,
        }, initOverrides);

        yield* this.parseStream(response, accept);
    }

    /**
     * Submit a job and also returns an event-stream object (async iterable)
     * Submit a job and stream its events
     */
    async *submitAndStreamJob(requestParameters: SubmitAndStreamJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent> {
        yield* this.submitAndStreamJobRaw(requestParameters, initOverrides);
    }

    /**
     * Submit a new job to generate images
     */
    async submitJobRaw(requestParameters: SubmitJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<JobStatusResponse>> {
        if (requestParameters['contentType'] == null) {
            throw new runtime.RequiredError(
                'contentType',
                'Required parameter "contentType" was null or undefined when calling submitJob().'
            );
        }

        if (requestParameters['jobRequest'] == null) {
            throw new runtime.RequiredError(
                'jobRequest',
                'Required parameter "jobRequest" was null or undefined when calling submitJob().'
            );
        }

        const queryParameters: any = {};
        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['accept'] != null) {
            headerParameters['Accept'] = String(requestParameters['accept']);
        }

        if (requestParameters['contentType'] != null) {
            headerParameters['Content-Type'] = String(requestParameters['contentType']);
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const body = this.encodeRequestBody(requestParameters['contentType'], requestParameters['jobRequest']);

        const response = await this.request({
            path: `/jobs/submit`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: body,
        }, initOverrides);

        return this.createApiResponse(response, requestParameters['accept'] || '', JobStatusResponseFromJSON);
    }

    /**
     * Submit a new job to generate images
     */
    async submitJob(requestParameters: SubmitJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<JobStatusResponse> {
        const response = await this.submitJobRaw(requestParameters, initOverrides);
        return await response.value();
    }
}

/**
 * @export
 */
export const ContentTypeEnum = {
    Json: 'application/json',
    VndMsgpack: 'application/vnd.msgpack',
    XMsgpack: 'application/x-msgpack'
} as const;
export type ContentTypeEnum = typeof ContentTypeEnum[keyof typeof ContentTypeEnum];

/**
 * @export
 */
export const AcceptEnum = {
    Json: 'application/json',
    VndMsgpack: 'application/vnd.msgpack',
    XMsgpack: 'application/x-msgpack'
} as const;
export type AcceptEnum = typeof AcceptEnum[keyof typeof AcceptEnum];

/**
 * @export
 */
export const StreamAcceptEnum = {
    TextEventStream: 'text/event-stream',
    VndMsgpackStream: 'application/vnd.msgpack-stream',
    XMsgpackStream: 'application/x-msgpack-stream'
} as const;
export type StreamAcceptEnum = typeof StreamAcceptEnum[keyof typeof StreamAcceptEnum];

