import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main() {
  const { id } = await cozy.jobs.submit({
    models: { "stable-diffusion": 2 },
    positive_prompt: 'Naruto logo as a sticker, minimalist',
    negative_prompt: '',
    aspect_ratio: '1/1',
    output_format: 'webp'
  });

  for await (const event of cozy.jobs.eventStream(id)) {
    console.log(event);
  }
}

main();

