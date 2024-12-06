import { CozyCreator, Text2MediaResult } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function main(): Promise<Text2MediaResult> {
  const { id, status } = await cozy.text2Media.submit({
    num_outputs: 2,
    model: "playground2.5",
    positive_prompt: "A beautiful sunset over the ocean",
    negative_prompt: "",
    aspect_ratio: "16/9",
    output_format: "webp",
  });

  while (true) {
    const { status } = await cozy.text2Media.getStatus(id);

    if (status === "COMPLETED") {
      return await cozy.text2Media.getJob(id);
    }

    if (status === "FAILED") {
      throw new Error("Job failed");
    }

    // Poll every second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main();
