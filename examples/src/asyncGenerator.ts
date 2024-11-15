import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  // baseUrl: "https://pg4z2pxjyyj7ow-8881.proxy.runpod.net/api/v1",
  // apiKey: "A3luySXOjctmjzkGTeIi-Loh4Za4tVaKftafvHYDssk",
  baseUrl: "http://localhost:8881/api/v1",
  apiKey: "UDR-JwDFT53ZpMYXSGAPdpWDnFDHbPMToqfDD6T1s2U",
});

async function main() {
  try {
    const stream = client.text2Media.submitAndStreamEvents({
      num_outputs: 1,
      aspect_ratio: "1/1",
      output_format: "png",
      model: "playground2.5",
      random_seed: Math.round(Math.random() * 100000),
      positive_prompt: "score_9, score_8_up, score_7_up, an anime woman",
      negative_prompt: "low quality, worst quality, watemrmark, blurry, text",
      webhook_url: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
    });

    for await (const event of stream) {
      if (event.type === "status") {
        console.log("Status event:", event.data.status);

        if (event.data.status === "COMPLETED") {
          console.log("Image generation completed!");
          break;
        }
      }

      console.log(event);
    }
  } catch (e: unknown) {
    console.log(e);
  }
}

main();
