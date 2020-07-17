import { createNode } from "./createNode";

const fileAdd = process.env.FILEADD;
const port = Number(process.env.PORT);
const filename = `./peerId${fileAdd}.json`;

const topic = "gossip";

(async () => {
  const node = await createNode(filename, port);

  await node.pubsub.subscribe(topic, (_msg: any) => {
    // console.log(`Received: ${msg.data.toString()}`);
  });

  setInterval(() => {
    const randomNumber = Math.floor(Math.random() * 9999);
    node.pubsub.publish(
      topic,
      Buffer.from(`Hey its me ${node.peerId.toB58String()} - ${randomNumber}`)
    );
  }, 100 + Math.random() * 100);
})();
