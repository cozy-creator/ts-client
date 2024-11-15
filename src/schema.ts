import { z } from "zod";

export const jobEventKind = z.enum(["status", "output", "error"]);
export const errorType = z.enum(["output_failed"]);
export const outputFormat = z.enum(["jpg", "png", "webp", "svg", "mp4"]);
export const workStatus = z.enum([
  "IN_QUEUE",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "CANCELED",
]);
export const aspectRatio = z.enum([
  "21/9",
  "16/9",
  "4/3",
  "1/1",
  "3/4",
  "9/16",
  "9/21",
]);

export const text2MediaRequest = z.object({
  model: z.string(),
  positive_prompt: z.string(),
  negative_prompt: z.string().optional(),
  num_outputs: z.number().optional(),
  output_format: outputFormat.optional(),
  random_seed: z.number().optional(),
  aspect_ratio: aspectRatio.optional(),
  webhook_url: z.string().optional(),
});

// Base event structure
const baseEvent = z.object({
  id: z.string().optional(), // message id from pulsar
  retry: z.number().optional(), // retry timeout in ms
});

// Status event
export const statusEvent = baseEvent.extend({
  type: z.literal("status"),
  data: z.object({
    job_id: z.string(),
    status: workStatus,
    error_message: z.string().optional(),
  }),
});

// Output event
export const outputEvent = baseEvent.extend({
  type: z.literal("output"),
  data: z.object({
    job_id: z.string(),
    mime_type: z.string(),
    url: z.string().optional(),
    file_bytes: z.instanceof(Uint8Array).optional(),
  }),
});

// Error event
export const errorEvent = baseEvent.extend({
  type: z.literal("error"),
  data: z.object({
    job_id: z.string(),
    error_type: z.string(),
    error_message: z.string().optional(),
  }),
});

// Combined event type
export const jobEvent = z.discriminatedUnion("type", [
  statusEvent,
  outputEvent,
  errorEvent,
]);

const imageOutput = z.object({
  mime_type: z.string(),
  url: z.string().optional(),
  file_bytes: z.instanceof(Uint8Array).optional(),
});

export const text2MediaResult = z.object({
  id: z.string(),
  status: workStatus,
  input: text2MediaRequest,
  events: z.array(jobEvent),
  output: z.array(imageOutput),
  created_at: z.string(),
  completed_at: z.string(),
  error_message: z.string().optional(),
});

export const uploadResponse = z.object({
  status: z.string(),
  data: z.object({
    url: z.string(),
  }),
});

export const node = z.object({
  id: z.string(),
  type: z.string(),
});

export const workflow = z.object({
  id: z.string(),
  nodes: z.array(node),
});

export const workflowResponse = z.object({
  id: z.string(),
  status: z.string(),
});

export const nodeOutput = z.record(z.any());

export const workflowOutput = z.object({
  node_id: z.string(),
  node_type: z.string(),
  output: nodeOutput,
  error: z.string().optional(),
});

export const jobStatusResponse = z.object({
  id: z.string(),
  status: workStatus,
});
