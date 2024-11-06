import { aspectRatio, outputFormat, text2ImageRequest } from "./schema";
import { Text2ImageRequest, AspectRatio, OutputFormat } from "./types";

export function isText2ImageRequest(obj: any): obj is Text2ImageRequest {
  return text2ImageRequest.safeParse(obj).success;
}

export function isValidAspectRatio(value: any): value is AspectRatio {
  return aspectRatio.safeParse(value).success;
}

export function isValidOutputFormat(value: any): value is OutputFormat {
  return outputFormat.safeParse(value).success;
}
