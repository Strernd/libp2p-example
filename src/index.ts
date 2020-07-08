// import delay from "delay";
import { createNode, createNodeFromFile } from "./createNode";

const topic = "gossip";
(async () => {
  let node: any;
  if (process.env.IS_SEED) {
    node = await createNodeFromFile("./nodeA.json", 6001);
  } else {
    node = await createNode(true);
  }

  await node.pubsub.subscribe("consensus", (msg: any) => {
    console.log(`Received: ${msg.data.toString()}`);
  });

  function sendStuff() {
    const randomNumber = Math.floor(Math.random() * 9999);
    console.log("sending ", randomNumber);
    node.pubsub.publish(
      topic,
      Buffer.from(`Hey its me ${node.peerId.toB58String()} - ${randomNumber}`)
    );
    setTimeout(() => {
      sendStuff();
    }, 5000 + 20000 * Math.random());
  }
  sendStuff();

  setInterval(() => {
    console.log("# connections:", node.connectionManager.size);
  }, 5000);
})();
