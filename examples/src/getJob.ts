import { CozyCreator } from "@cozy-creator/ts-client";

const cozy = new CozyCreator({
  baseUrl: "http://localhost:8881",
  apiKey: "UDR-JwDFT53ZpMYXSGAPdpWDnFDHbPMToqfDD6T1s2U",
});

async function main() {
  const job = await cozy.text2Media.getJob(
    "1b0460c2-715e-4434-96dc-219380dab998"
  );
  console.log(job);
}

main();
