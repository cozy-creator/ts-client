import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  baseUrl: "http://localhost:9009/api/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  try {
    const stream = client.text2Image.submitWithEventStream({
      // models: { "stable-diffusion": 1 },
      // positive_prompt: 'A beautiful sunset over the ocean',
      // negative_prompt: '',
      // aspect_ratio: '16/9',
      // output_format: 'webp'

      models: { "playground2.5": 4 },
      positive_prompt: "Naruto logo as a sticker, minimalist",
      negative_prompt: "",
      aspect_ratio: "1/1",
      output_format: "png",
      webhook_url: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
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
