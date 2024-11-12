import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  baseUrl: "https://gwsrynqpn4wbbb-8881.proxy.runpod.net/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  try {
    const stream = client.text2Media.submitAndStreamEvents({
      num_outputs: 2,
      model: "pony.v6",
      positive_prompt: "score_9, score_8_up, score_7_up, an anime woman",
      negative_prompt: "low quality, worst quality, watermark, blurry, text",
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
