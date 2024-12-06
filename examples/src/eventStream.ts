import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  const { id } = await cozy.text2Media.submit({
    num_outputs: 1,
    negative_prompt: "",
    aspect_ratio: "1/1",
    output_format: "png",
    model: "playground2.5",
    positive_prompt: "Naruto logo as a sticker, minimalist",
    webhook_url: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
  });

  for await (const event of cozy.text2Media.streamEvents(id)) {
    if (event.type === "status") {
      if (event.data.status === "COMPLETED") {
        console.log("Image generation completed!");
        break;
      }
    }

    console.log(event);
  }
}

main();
