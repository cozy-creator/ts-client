import * as runtime from "./runtime";
import { FileApi, GenerationApi, WorkflowApi } from "./apis";

interface CozyCreatorConstructorParameters
  extends runtime.ConfigurationParameters {}

export class CozyCreator extends runtime.BaseAPI {
  #fileApi: FileApi;
  #workflowApi: WorkflowApi;
  #generationApi: GenerationApi;

  constructor(params: CozyCreatorConstructorParameters = {}) {
    if (typeof params.apiKey != "string")
      throw new Error("apiKey must be a string");

    if (!params.headers) {
      params.headers = {};
    }

    params.headers["X-API-Key"] = params.apiKey;
    const configuration = new runtime.Configuration(params);

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
