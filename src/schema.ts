import { z } from "zod";

export const jobStreamEventType = z.enum(["status", "output", "error"]);
export const outputFormat = z.enum(["jpg", "png", "webp"]);
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

export const text2ImageRequest = z.object({
  positive_prompt: z.string(),
  models: z.record(z.number()),
  webhook_url: z.string().optional(),
  random_seed: z.number().optional(),
  aspect_ratio: aspectRatio.optional(),
  negative_prompt: z.string().optional(),
  output_format: outputFormat.optional(),
  another: z.string().optional(),
});

export const text2MediaResult = z.object({
  id: z.string(),
  status: workStatus,
  input: text2ImageRequest,
  output_events: z.array(z.object({
    model: z.string(),
    mimeType: z.string(),
    url: z.string().optional(),
    fileBytes: z.instanceof(Uint8Array).optional()
  })),
  error_events: z.array(z.object({
    model: z.string(),
    errorMessage: z.string()
  })),
  created_at: z.string(),
  completed_at: z.string(),
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
    }),
});

// Output event
export const outputEvent = baseEvent.extend({
    type: z.literal("output"),
    data: z.object({
        job_id: z.string(),
        model: z.string(),
        mimeType: z.string(),
        url: z.string().optional(),
        fileBytes: z.instanceof(Uint8Array).optional(),
    }),
});

// Error event
export const errorEvent = baseEvent.extend({
    type: z.literal("error"),
    data: z.object({
        job_id: z.string(),
        model: z.string(),
        errorMessage: z.string(),
    }),
});

// Combined event type
export const jobStreamEvent = z.discriminatedUnion("type", [
    statusEvent,
    outputEvent,
    errorEvent,
]);

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
  nodeID: z.string(),
  nodeType: z.string(),
  output: nodeOutput,
  error: z.string().optional(),
});

export const jobStatusResponse = z.object({
  id: z.string(),
  status: workStatus,
});
