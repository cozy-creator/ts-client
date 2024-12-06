This is a TypeScript-Fetch client for interacting with our Gen-Server. It follows the Gen-Server's [OpenAPI-specification](https://github.com/cozy-creator/gen-server/tree/dev/openapi/v1/openapi.yaml).

Add the client package to your project:

```bash
yarn add @cozy-creator/gen-server-ts-client
```

Use the client in a simple polling script:

```typescript
import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main(): Promise<Text2MediaResult> {
  const { id, status } = await cozy.text2Media.submit({
    models: { "stable-diffusion": 1 },
    positive_prompt: 'A beautiful sunset over the ocean',
    negative_prompt: '',
    aspect_ratio: '16/9',
    output_format: 'webp'
  });

  while (true) {
    const { status } = await cozy.text2Media.getStatus(id);

    if (status === 'COMPLETED') {
      return await cozy.text2Media.getResult(id);
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

---

### Notes:

OpenAPI can auto-generate clients, but it was impossible to make a client that could handle streams and message-pack encoding/decoding, plus the code it wrote was mostly trash. Hence why we wrote this client by hand. Honestly I'm pretty bearish on old-fashioned auto-generated code now that we have LLMs.
