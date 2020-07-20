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

export async function createPeerId(filename: string) {
  const id = ((await PeerId.create({
    bits: 2048,
    keyType: "rsa",
  } as any)) as unknown) as PeerId;
  fs.writeFileSync(filename, JSON.stringify(id.toJSON()));
}

export const createNode = async (filename: string, port?: number) => {
  const content = fs.readFileSync(filename).toString();
  const peerId = await PeerId.createFromJSON(JSON.parse(content));
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
      peerDiscovery: [Bootstrap],
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          interval: 10e3,
          enabled: true,
          list: [
            "/dns4/comm-a/tcp/6000/p2p/QmaMEafwe3Nc62va1WVwfn5MZ8rrcmPJbvf314ZsE1rVFd",
            "/dns4/comm-b/tcp/6000/p2p/QmXb4CTfb3aN3VVraZD6sZ6LGot8FFSEyd5NkP3fpQfseD",
            "/dns4/comm-c/tcp/6000/p2p/QmP1DFWDc2jWizJTkJEbytYwfPWYyBviusQgjmT3xmoN5z",
            "/dns4/comm-d/tcp/6000/p2p/QmeMRQdzXNmLtE5ZLeq8bELbpknRZXLDKwJaweFbobEEWr",
          ],
          // list: [
          //   "/ip4/127.0.0.1/tcp/6001/p2p/QmaMEafwe3Nc62va1WVwfn5MZ8rrcmPJbvf314ZsE1rVFd",
          //   "/ip4/127.0.0.1/tcp/6002/p2p/QmXb4CTfb3aN3VVraZD6sZ6LGot8FFSEyd5NkP3fpQfseD",
          //   "/ip4/127.0.0.1/tcp/6003/p2p/QmP1DFWDc2jWizJTkJEbytYwfPWYyBviusQgjmT3xmoN5z",
          //   "/ip4/127.0.0.1/tcp/6004/p2p/QmeMRQdzXNmLtE5ZLeq8bELbpknRZXLDKwJaweFbobEEWr",
          // ],
        },
      },
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

  const node = await (Libp2p as any).create(cfg);
  await node.start();

  node.connectionManager.on("peer:connect", async (connection: any) => {
    console.log(
      "CONNECT Connection established to:",
      connection.remotePeer.toB58String()
    );
  });
  node.connectionManager.on("peer:disconnect", (connection: any) => {
    console.log(
      "DISCONNECT Connection closed to:",
      connection.remotePeer.toB58String()
    );
  });
  console.log(
    `Created node with id ${node.peerId.toB58String()} and addrs ${node.multiaddrs.join(
      ","
    )}`
  );

  return node;
};
