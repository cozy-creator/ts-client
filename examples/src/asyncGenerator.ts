import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  baseUrl: "http://localhost:9009/api/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

// /jobs/submit
// /jobs/flux.1-dev/submit

async function main() {
  try {
    const stream = client.text2Media.submitAndStreamEvents({
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
      random_seed: Math.round(Math.random() * 100000),
    });

    for await (const event of stream) {
      console.log("Received new event:", event.type);
      console.log(event);
    }
  } catch (e: unknown) {
    console.log(e);
  }
}

main();

// 9c3I1grWwYMS278W
// postgresql://postgres.xszgovglpyjgdqkqhpon:9c3I1grWwYMS278W@aws-0-us-west-1.pooler.supabase.com:6543/postgres
