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

export const jobResult = z.object({
  id: z.string(),
  status: workStatus,
  input: text2ImageRequest,
  output: z.record(z.array(z.string())),
  created_at: z.string(),
  completed_at: z.string(),
});

export const jobStreamEvent = z.object({
  event: jobStreamEventType,
  data: z.object({
    job_id: z.string(),
    url: z.string().optional(),
    model: z.string().optional(),
    status: workStatus.optional(),
    errorMessage: z.string().optional(),
  }),
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
  nodeID: z.string(),
  nodeType: z.string(),
  output: nodeOutput,
  error: z.string().optional(),
});

export const jobStatusResponse = z.object({
  id: z.string(),
  status: workStatus,
});
