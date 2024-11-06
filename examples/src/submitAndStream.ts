import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  baseUrl: "http://localhost:8881/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  try {
    const stream = client.jobs.submitAndStreamJob({
      models: { "stable-diffusion": 1 },
      positive_prompt: 'A beautiful sunset over the ocean',
      negative_prompt: '',
      aspect_ratio: '16/9',
      output_format: 'webp'
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
