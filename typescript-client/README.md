This is a TypeScript-Fetch client for interacting with our Gen-Server. It was auto-generated using our [OpenAPI-specification](https://github.com/cozy-creator/gen-server/tree/dev/openapi/v1/openapi.yaml).

Add the client package to your project:

```bash
yarn add @cozy-creator/gen-server-ts-client
```

Use the client like this:

```typescript
import { CozyCreator, SubmitJobContentTypeEnum, JobRequestAspectRatioEnum, JobRequestOutputFormatEnum } from "@cozy-creator/gen-server-ts-client";

const cozy = new CozyCreator({
  basePath: "http://localhost:8881/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

const data = {
    contentType: SubmitJobContentTypeEnum.Json,
    jobRequest: {
    webhookUrl: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
    positivePrompt: "Splatoon characters, anime style, highly detailed, colorful",
    models: { sdxl: 2 },
    aspectRatio: JobRequestAspectRatioEnum._11,
    outputFormat: JobRequestOutputFormatEnum.Webp,
    randomSeed: 123,
    },
};

const response = await cozy.generation.submitJob(data);
```
