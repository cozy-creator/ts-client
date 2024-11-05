import * as runtime from "./runtime";
import { FileApi, WorkflowApi } from "./apis";
import { GenerationApiWrapper } from "./apis/GenerationApiWrapper";

export class CozyCreator extends runtime.BaseAPI {
  #fileApi: FileApi;
  #generationApi: GenerationApiWrapper;
  #workflowApi: WorkflowApi;

  constructor(params?: runtime.ConfigurationParameters) {
    const configuration = new runtime.Configuration(params);
    super(configuration);

    this.#fileApi = new FileApi(this.configuration);
    this.#generationApi = new GenerationApiWrapper(this.configuration);
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
