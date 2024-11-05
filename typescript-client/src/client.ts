import * as runtime from "./runtime";
import { FileApi, WorkflowApi } from "./apis";
import { GenerationApi } from "./apis/";

export class CozyCreator extends runtime.BaseAPI {
  #fileApi: FileApi;
  #generationApi: GenerationApi;
  #workflowApi: WorkflowApi;

  constructor(params?: runtime.ConfigurationParameters) {
    const configuration = new runtime.Configuration(params);
    super(configuration);

    this.#fileApi = new FileApi(this.configuration);
    this.#generationApi = new GenerationApi(this.configuration);
    this.#workflowApi = new WorkflowApi(this.configuration);
  }

  public get file() {
    return this.#fileApi;
  }
  public get generation() {
    return this.#generationApi;
  }
  public get workflow() {
    return this.#workflowApi;
  }
}
