import * as runtime from "./runtime";
import { FileApi, GenerationApi, WorkflowApi } from "./apis";

export class CozyCreator extends runtime.BaseAPI {
  public file: FileApi;
  public workflow: WorkflowApi;
  public generation: GenerationApi;

  constructor(configuration?: runtime.Configuration) {
    super(configuration);

    this.file = new FileApi(this.configuration);
    this.workflow = new WorkflowApi(this.configuration);
    this.generation = new GenerationApi(this.configuration);
  }
}
