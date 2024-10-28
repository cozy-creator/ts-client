const { CozyCreator } = require("../dist");

const cozy = new CozyCreator({
  basePath: "http://localhost:9009/api/v1",
  apiKey: "LtozVIUp9dAvfZSe6HAWCDZWtJfP1uTC",
});

async function generate() {
  try {
    const data = {
      generateParams: {
        webhookUrl: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
        positivePrompt: "A photo of a cat",
        models: { sdxl: 2 },
        aspectRatio: "1/1",
        outputFormat: "png",
        randomSeed: 4,
      },
    };

    console.log(data);

    const response = await cozy.generation.generateAsync(data);
    console.log(response);
  } catch (e) {
    // handle error

    console.log(e);
  }
}

// async function generateAsync() {
//   const data = {};
//   const response = await fetch("http://localhost:9009/api/v1/generate_async", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   const json = await response.json();
//   console.log(json);
// }

// async function generateAsync() {
//   const data: GenerateRequest = {
//     generateParams: {
//       positivePrompt: "A photo of a cat",
//       models: { "flux.1-schnell": 2 },
//       aspectRatio: "1:1",
//       outputFormat: "png",
//       randomSeed: 123,
//       webhookUrl: "https://cozy.dev/webhook",
//     },
//   };

//   const response = await cozy.generation.generateAsync(data);
//   console.log(response);
// }

generate();
