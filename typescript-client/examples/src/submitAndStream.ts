import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  basePath: "http://localhost:8881/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  try {
    const stream = client.generation.submitAndStreamJob({
        jobRequest: {
            models: { "stable-diffusion": 1 },
            positivePrompt: 'A beautiful sunset over the ocean',
            negativePrompt: '',
            aspectRatio: '16/9',
            outputFormat: 'webp'
        }
    });

    for await (const event of stream) {
        console.log(event);
    }
  } catch (e: unknown) {
    // handle error
    console.log(e);
  }
}

main();
