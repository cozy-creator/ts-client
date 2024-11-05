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
