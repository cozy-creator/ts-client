/* Request and Response Options */
export interface RequestOptions {
  headers?: HeadersInit;
}

type UUID = string;

export type JobStreamEventType = "status" | "output";
export type OutputFormat = "jpg" | "png" | "webp";
export type JobStatus = "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export type AspectRatio =
  | "21/9"
  | "16/9"
  | "4/3"
  | "1/1"
  | "3/4"
  | "9/16"
  | "9/21";

export interface JobStatusResponse {
  id: string;
  status: JobStatus;
}

export interface JobRequest {
  models: { [key: string]: number };
  random_seed?: number;
  aspect_ratio?: AspectRatio;
  positive_prompt: string;
  negative_prompt?: string;
  output_format?: OutputFormat;
  webhook_url?: string;
}

export interface JobResult {
  id: UUID;
  status: JobStatus;
  input: JobRequest;
  output: {
    [modelName: string]: string[];
  };
  created_at: string; // ISO date-time
  completed_at: string; // ISO date-time
}

export interface JobStreamEvent {
  type: JobStreamEventType;
  data: {
    job_id: UUID;
    url?: string;
    model?: string;
    status?: JobStatus;
  };
}

export interface UploadResponse {
  status: string;
  data: {
    url: string;
  };
}

export interface Node {
  id: string;
  type: string;
}

export interface Workflow {
  id: string;
  nodes: Node[];
}

export interface WorkflowResponse {
  id: string;
  status: string;
}

export interface NodeOutput {
  [key: string]: any;
}

export interface WorkflowOutput {
  nodeID: string;
  nodeType: string;
  output: NodeOutput;
  error?: string | null;
}

export type EventType = "open" | "message" | "error";

export interface EventSourceInitDict {
  rejectUnauthorized?: boolean;
  withCredentials?: boolean;
  headers?: HeadersInit;
  method?: string;
  retry?: number;
  body?: any;
}

export interface MessageEventListener {
  (evt: MessageEvent): void;
}
