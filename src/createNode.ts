import Libp2p from "libp2p";
import TCP from "libp2p-tcp";
import Mplex from "libp2p-mplex";
import { NOISE } from "libp2p-noise";
import SECIO from "libp2p-secio";
import KadDHT from "libp2p-kad-dht";
import PeerId from "peer-id";
import Gossipsub from "libp2p-gossipsub";
import Bootstrap from "libp2p-bootstrap";
import fs from "fs";
import pipe from "it-pipe";
import lp from "it-length-prefixed";
import { Readable } from "stream";

const handleStream = async (stream: any, reader: Readable) => {
  pipe(reader, lp.encode(), stream.sink);
  pipe(stream.source, lp.decode(), async function (source: any) {
    for await (const msg of source) {
      // Output the data as a utf8 string
      console.log("x " + msg.toString("utf8").replace("\n", ""));
    }
  });
};

export const createNodeFromFile = async (filename: string, port?: number) => {
  const content = fs.readFileSync(filename).toString();
  const id = await PeerId.createFromJSON(JSON.parse(content));
  return createNode(false, id, port);
};

export const createNode = async (
  bootstrap: boolean,
  peerId?: any,
  port?: number
) => {
  //@ts-ignore
  const cfg: any = {
    peerId,
    addresses: {
      listen: [`/ip4/0.0.0.0/tcp/${port || 0}`],
    },
    modules: {
      transport: [TCP],
      streamMuxer: [Mplex],
      connEncryption: [NOISE, SECIO],
      dht: KadDHT,
      pubsub: Gossipsub,
    },
    config: {
      dht: {
        enabled: true,
        randomWalk: {
          enabled: true,
          interval: 60e3,
          timeout: 10e3,
        },
      },
    },
  };
  if (bootstrap) {
    cfg.modules.peerDiscovery = [Bootstrap];
    cfg.config.peerDiscovery = {
      bootstrap: {
        interval: 10e3,
        enabled: true,
        list: [
          "/ip4/127.0.0.1/tcp/6001/p2p/QmQ1rBEjFckGvbLHFqNBcNt4xbbXjp62bCfo7D3hif3qTU",
        ],
      },
    };
  }
  const node = await (Libp2p as any).create(cfg);

  await node.start();
  node.handle("greetings/1.0.0", async ({ stream }: { stream: any }) => {
    console.log("handle called");
    const reader = new Readable();
    reader._read = () => {};
    handleStream(stream, reader);
    setInterval(() => {
      reader.push(`hehe from handler`);
    }, 2000);
  });
  node.connectionManager.on("peer:connect", async (connection: any) => {
    console.log(
      "CONNECT Connection established to:",
      connection.remotePeer.toB58String()
    );
    const { stream } = await connection.newStream(["greetings/1.0.0"]);
    const reader = new Readable();
    reader._read = () => {};
    handleStream(stream, reader);
    setInterval(() => {
      reader.push(`hehe from con`);
    }, 2000);
  });
  node.connectionManager.on("peer:disconnect", (connection: any) => {
    console.log(
      "DISCONNECT Connection closed to:",
      connection.remotePeer.toB58String()
    );
  });
  node.connectionManager.on("peer:discovery", (connection: any) => {
    console.log("DISCOVERY found peer:", connection.remotePeer.toB58String());
  });
  console.log(
    `Created node with id ${node.peerId.toB58String()} and addrs ${node.multiaddrs.join(
      ","
    )}`
  );

  return node;
};
