import { CozyCreator } from "@cozy-creator/ts-client";

const client = new CozyCreator({
  baseUrl: "https://pg4z2pxjyyj7ow-8881.proxy.runpod.net/api/v1",
  apiKey: "A3luySXOjctmjzkGTeIi-Loh4Za4tVaKftafvHYDssk",
});

async function main() {
  try {
    const stream = client.text2Media.submitAndStreamEvents({
      num_outputs: 1,
      aspect_ratio: "1/1",
      output_format: "png",
      model: "pony.realism",
      random_seed: Math.round(Math.random() * 100000),
      positive_prompt: "score_9, score_8_up, score_7_up, an anime woman",
      negative_prompt: "low quality, worst quality, watermark, blurry, text",
      webhook_url: "https://webhook.site/a433f22f-028a-4da9-b435-619d8f4cd141",
    });

    for await (const event of stream) {
      switch (event.type) {
        case 'output':
          if ('url' in event.data) {
            if (event.data.mime_type.startsWith('image/')) {
              console.log('new image url: ', event.data.url);
            } else if (event.data.mime_type.startsWith('video/')) {
              console.log('new video url: ', event.data.url);
            }
          } else {
            console.log('new raw file bytes: ', event.data.file_bytes);
          }

          break;

        case 'error':
          if (event.data.error_type === 'output_failed') {
            console.log('output failed: ', event.data.error_message);
          }

          break;

        case 'status':
          switch (event.data.status) {
            case 'IN_QUEUE':
              console.log('job in queue');
              break;
            case 'IN_PROGRESS':
              console.log('job in progress');
              break;
            case 'COMPLETED':
              console.log('job completed');
              break;
            case 'FAILED':
              console.log('job failed', event.data.error_message);
              break;
            case 'CANCELED':
              console.log('job canceled');
              break;
          }

          break;
      }
    }
  } catch (e: unknown) {
    console.log(e);
  }
}

main();
