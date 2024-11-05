import * as runtime from '../runtime';
import type { JobRequest, JobStreamEvent } from '../models';
import { JobRequestToJSON } from '../models';

export type ContentType = 'application/json' | 'application/vnd.msgpack';
export type AcceptType = 'text/event-stream' | 'application/vnd.msgpack-stream';

export interface SubmitAndStreamJobRequest {
    jobRequest: JobRequest;
    contentType?: ContentType;
    accept?: AcceptType;
}

export class CustomGenerationApi extends runtime.BaseAPI {
    async *submitAndStreamJob(requestParameters: SubmitAndStreamJobRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): AsyncIterableIterator<JobStreamEvent> {
        if (requestParameters.jobRequest == null) {
            throw new runtime.RequiredError('jobRequest', 'Required parameter requestParameters.jobRequest was null or undefined.');
        }

        const headerParameters: runtime.HTTPHeaders = {};

        // Default to msgpack if not specified
        const contentType = requestParameters.contentType ?? 'application/vnd.msgpack';
        headerParameters['Content-Type'] = contentType;
        
        // If accept is not specified, derive it from content type
        const accept = requestParameters.accept ?? (
            contentType === 'application/json' ? 'text/event-stream' : 'application/vnd.msgpack-stream'
        );
        headerParameters['Accept'] = accept;

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key");
        }

        const response = await this.request({
            path: `/jobs/submit-and-stream-events`,
            method: 'POST',
            headers: headerParameters,
            body: JobRequestToJSON(requestParameters.jobRequest),
        }, initOverrides);

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is null');
        }

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
                        const event = JSON.parse(data) as JobStreamEvent;
                        yield event;
                    } catch (e) {
                        console.warn('Failed to parse SSE data:', e);
                    }
                }
            }
        }
    }
}