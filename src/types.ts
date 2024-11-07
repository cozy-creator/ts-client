import { z } from "zod";
import {
  aspectRatio,
  text2MediaResult,
  workStatus,
  jobStatusResponse,
  statusEvent,
  outputEvent,
  errorEvent,
  jobStreamEvent,
  jobStreamEventType,
  node,
  nodeOutput,
  outputFormat,
  text2ImageRequest,
  uploadResponse,
  workflow,
  workflowOutput,
  workflowResponse,
} from "./schema";

/* Request and Response Options */
export interface RequestOptions {
  headers?: HeadersInit;
}

// Typescript types derived from zod schemas
export type StatusEvent = z.infer<typeof statusEvent>;
export type OutputEvent = z.infer<typeof outputEvent>;
export type ErrorEvent = z.infer<typeof errorEvent>;
export type JobStreamEvent = z.infer<typeof jobStreamEvent>;
export type JobStreamEventType = z.infer<typeof jobStreamEventType>;
export type OutputFormat = z.infer<typeof outputFormat>;
export type WorkStatus = z.infer<typeof workStatus>;
export type AspectRatio = z.infer<typeof aspectRatio>;

export type Text2ImageRequest = z.infer<typeof text2ImageRequest>;
export type Text2MediaResult = z.infer<typeof text2MediaResult>;
export type UploadResponse = z.infer<typeof uploadResponse>;
export type Node = z.infer<typeof node>;
export type JobStatusResponse = z.infer<typeof jobStatusResponse>;
export type Workflow = z.infer<typeof workflow>;
export type WorkflowResponse = z.infer<typeof workflowResponse>;
export type NodeOutput = z.infer<typeof nodeOutput>;
export type WorkflowOutput = z.infer<typeof workflowOutput>;

export type SSEEventType = "data" | "id" | "event" | "retry";
export interface SSEEvent {
  id?: string;
  data?: string;
  event?: string;
  retry?: number;
  [key: string]: any;
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
