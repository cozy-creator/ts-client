import { decode } from "msgpackr";

export function mergeHeaders(
  headers: Headers,
  ...customHeaders: Headers[]
): Headers {
  const mergedHeaders = new Headers(headers);

  for (const customHeader of customHeaders) {
    for (const [key, value] of customHeader.entries()) {
      mergedHeaders.set(key, value);
    }
  }

  return mergedHeaders;
}

export async function throwResponseError(response: Response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
        throw await response.json();
    } else if (contentType?.includes('msgpack')) {
        const buffer = await response.arrayBuffer();
        throw decode(new Uint8Array(buffer));
    } else {
        // Fallback for plain text
        throw new Error(await response.text());
    }
}
