import { Text2ImageRequest, AspectRatio, OutputFormat } from "./types";

export function isText2ImageRequest(obj: any): obj is Text2ImageRequest {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Check required properties
  if (typeof obj.positive_prompt !== 'string') {
    return false;
  }

  if (typeof obj.models !== 'object' || obj.models === null) {
    return false;
  }

  for (const key in obj.models) {
    if (typeof obj.models[key] !== 'number') {
      return false;
    }
  }

  // Check optional properties
  if (obj.random_seed !== undefined && typeof obj.random_seed !== 'number') {
    return false;
  }

  if (obj.aspect_ratio !== undefined && !isValidAspectRatio(obj.aspect_ratio)) {
    return false;
  }

  if (obj.negative_prompt !== undefined && typeof obj.negative_prompt !== 'string') {
    return false;
  }

  if (obj.output_format !== undefined && !isValidOutputFormat(obj.output_format)) {
    return false;
  }

  if (obj.webhook_url !== undefined && typeof obj.webhook_url !== 'string') {
    return false;
  }

  return true;
}

export function isValidAspectRatio(value: any): value is AspectRatio {
  return ["21/9", "16/9", "4/3", "1/1", "3/4", "9/16", "9/21"].includes(value);
}

export function isValidOutputFormat(value: any): value is OutputFormat {
  return ["jpg", "png", "webp"].includes(value);
}
