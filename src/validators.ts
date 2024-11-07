import { aspectRatio, outputFormat, text2ImageRequest, text2MediaResult } from "./schema";
import { Text2ImageRequest, AspectRatio, OutputFormat, Text2MediaResult } from "./types";

export function isText2ImageRequest(obj: any): obj is Text2ImageRequest {
  return text2ImageRequest.safeParse(obj).success;
}

export function isValidAspectRatio(value: any): value is AspectRatio {
  return aspectRatio.safeParse(value).success;
}

export function isValidOutputFormat(value: any): value is OutputFormat {
  return outputFormat.safeParse(value).success;
}

export function isValidText2MediaResult(value: any): value is Text2MediaResult {
  return text2MediaResult.safeParse(value).success;
}
