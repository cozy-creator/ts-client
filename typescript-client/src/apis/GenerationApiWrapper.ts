import { GenerationApi } from './GenerationApi';
import { CustomGenerationApi } from './CustomGenerationApi';
import type { SubmitAndStreamJobRequest } from './CustomGenerationApi';
import type { JobStreamEvent } from '../models';

// Create a new base type without the method we want to override
type GenerationApiWithoutStream = Omit<GenerationApi, 'submitAndStreamJob'>;

// Extend the modified base class
export class GenerationApiWrapper extends (GenerationApi as unknown as { new (...args: any[]): GenerationApiWithoutStream }) {
    private customApi: CustomGenerationApi;

    constructor(configuration?: any) {
        super(configuration);
        this.customApi = new CustomGenerationApi(configuration);
    }

    async *submitAndStreamJob(requestParameters: SubmitAndStreamJobRequest): AsyncIterableIterator<JobStreamEvent> {
        return this.customApi.submitAndStreamJob(requestParameters);
    }
}