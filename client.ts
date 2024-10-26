import * as runtime from "./runtime";
import { FileApi, GenerationApi, WorkflowApi } from "./apis";

export class CozyCreator extends runtime.BaseAPI {
  #fileApi: FileApi;
  #workflowApi: WorkflowApi;
  #generationApi: GenerationApi;

  constructor(configuration?: runtime.Configuration) {
    super(configuration);

    this.#fileApi = new FileApi(this.configuration);
    this.#workflowApi = new WorkflowApi(this.configuration);
    this.#generationApi = new GenerationApi(this.configuration);
  }

  public get file() {
    return this.#fileApi;
  }

  public get workflow() {
    return this.#workflowApi;
  }

  public get generation() {
    return this.#generationApi;
  }
}
