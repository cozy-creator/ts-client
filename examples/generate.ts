import { GenerateRequest } from "../apis";
import { CozyCreator } from "../client";

const cozy = new CozyCreator();

async function generate() {
  const data: GenerateRequest = {
    generateParams: {
      positivePrompt: "A photo of a cat",
      models: { "flux.1-schnell": 2 },
      aspectRatio: "1:1",
      outputFormat: "png",
      randomSeed: 123,
    },
  };
  const response = await cozy.generation.generateAsync(data);
  console.log(response);
}

async function generateAsync() {
  const data: GenerateRequest = {
    generateParams: {
      positivePrompt: "A photo of a cat",
      models: { "flux.1-schnell": 2 },
      aspectRatio: "1:1",
      outputFormat: "png",
      randomSeed: 123,
      webhookUrl: "https://cozy.dev/webhook",
    },
  };

  const response = await cozy.generation.generateAsync(data);
  console.log(response);
}


