import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:9009/api/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  const { id } = await cozy.text2Media.submit({
    models: { "playground2.5": 2 },
    positive_prompt: "Naruto logo as a sticker, minimalist",
    negative_prompt: "",
    aspect_ratio: "1/1",
    output_format: "webp",
    webhook_url: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
  });

  for await (const event of cozy.text2Media.streamEvents(id)) {
    console.log(event);
  }
}

main();
