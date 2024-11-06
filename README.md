This is a TypeScript-Fetch client for interacting with our Gen-Server. It was auto-generated using our [OpenAPI-specification](https://github.com/cozy-creator/gen-server/tree/dev/openapi/v1/openapi.yaml).

Add the client package to your project:

```bash
yarn add @cozy-creator/gen-server-ts-client
```

Use the client in a simple polling script:

```typescript
import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main(): Promise<JobResult> {
  const { id, status } = await cozy.jobs.submitJob({
    models: { "stable-diffusion": 1 },
    positive_prompt: 'A beautiful sunset over the ocean',
    negative_prompt: '',
    aspect_ratio: '16/9',
    output_format: 'webp'
  });

  while (true) {
    const { status } = await cozy.jobs.getJobStatus(id);

    if (status === 'COMPLETED') {
      return await cozy.jobs.getJobResult(id);
    }

    if (status === 'FAILED') {
      throw new Error('Job failed');
    }

    // Poll every second
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main();
```
