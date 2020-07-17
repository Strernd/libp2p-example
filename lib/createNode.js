"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = exports.createPeerId = void 0;
const libp2p_1 = __importDefault(require("libp2p"));
const libp2p_tcp_1 = __importDefault(require("libp2p-tcp"));
const libp2p_mplex_1 = __importDefault(require("libp2p-mplex"));
const libp2p_noise_1 = require("libp2p-noise");
const libp2p_secio_1 = __importDefault(require("libp2p-secio"));
const libp2p_kad_dht_1 = __importDefault(require("libp2p-kad-dht"));
const peer_id_1 = __importDefault(require("peer-id"));
const libp2p_gossipsub_1 = __importDefault(require("libp2p-gossipsub"));
const libp2p_bootstrap_1 = __importDefault(require("libp2p-bootstrap"));
const fs_1 = __importDefault(require("fs"));
async function createPeerId(filename) {
    const id = (await peer_id_1.default.create({
        bits: 2048,
        keyType: "rsa",
    }));
    fs_1.default.writeFileSync(filename, JSON.stringify(id.toJSON()));
}
exports.createPeerId = createPeerId;
exports.createNode = async (filename, port) => {
    const content = fs_1.default.readFileSync(filename).toString();
    const peerId = await peer_id_1.default.createFromJSON(JSON.parse(content));
    const cfg = {
        peerId,
        addresses: {
            listen: [`/ip4/0.0.0.0/tcp/${port || 0}`],
        },
        modules: {
            transport: [libp2p_tcp_1.default],
            streamMuxer: [libp2p_mplex_1.default],
            connEncryption: [libp2p_noise_1.NOISE, libp2p_secio_1.default],
            dht: libp2p_kad_dht_1.default,
            pubsub: libp2p_gossipsub_1.default,
            peerDiscovery: [libp2p_bootstrap_1.default],
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
    const node = await libp2p_1.default.create(cfg);
    await node.start();
    node.connectionManager.on("peer:connect", async (connection) => {
        console.log("CONNECT Connection established to:", connection.remotePeer.toB58String());
    });
    node.connectionManager.on("peer:disconnect", (connection) => {
        console.log("DISCONNECT Connection closed to:", connection.remotePeer.toB58String());
    });
    console.log(`Created node with id ${node.peerId.toB58String()} and addrs ${node.multiaddrs.join(",")}`);
    return node;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jcmVhdGVOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUE0QjtBQUM1Qiw0REFBNkI7QUFDN0IsZ0VBQWlDO0FBQ2pDLCtDQUFxQztBQUNyQyxnRUFBaUM7QUFDakMsb0VBQW9DO0FBQ3BDLHNEQUE2QjtBQUM3Qix3RUFBeUM7QUFDekMsd0VBQXlDO0FBQ3pDLDRDQUFvQjtBQUViLEtBQUssVUFBVSxZQUFZLENBQUMsUUFBZ0I7SUFDakQsTUFBTSxFQUFFLEdBQUksQ0FBQyxNQUFNLGlCQUFNLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLEtBQUs7S0FDUixDQUFDLENBQXVCLENBQUM7SUFDakMsWUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFORCxvQ0FNQztBQUVZLFFBQUEsVUFBVSxHQUFHLEtBQUssRUFBRSxRQUFnQixFQUFFLElBQWEsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sT0FBTyxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckQsTUFBTSxNQUFNLEdBQUcsTUFBTSxpQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFaEUsTUFBTSxHQUFHLEdBQVE7UUFDZixNQUFNO1FBQ04sU0FBUyxFQUFFO1lBQ1QsTUFBTSxFQUFFLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUMxQztRQUNELE9BQU8sRUFBRTtZQUNQLFNBQVMsRUFBRSxDQUFDLG9CQUFHLENBQUM7WUFDaEIsV0FBVyxFQUFFLENBQUMsc0JBQUssQ0FBQztZQUNwQixjQUFjLEVBQUUsQ0FBQyxvQkFBSyxFQUFFLHNCQUFLLENBQUM7WUFDOUIsR0FBRyxFQUFFLHdCQUFNO1lBQ1gsTUFBTSxFQUFFLDBCQUFTO1lBQ2pCLGFBQWEsRUFBRSxDQUFDLDBCQUFTLENBQUM7U0FDM0I7UUFDRCxNQUFNLEVBQUU7WUFDTixhQUFhLEVBQUU7Z0JBQ2IsU0FBUyxFQUFFO29CQUNULFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO29CQUNiLElBQUksRUFBRTt3QkFDSiwwRUFBMEU7d0JBQzFFLDBFQUEwRTt3QkFDMUUsMEVBQTBFO3dCQUMxRSwwRUFBMEU7cUJBQzNFO2lCQUNGO2FBQ0Y7WUFDRCxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxJQUFJO29CQUNiLFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixNQUFNLElBQUksR0FBRyxNQUFPLGdCQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRW5CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxVQUFlLEVBQUUsRUFBRTtRQUNsRSxPQUFPLENBQUMsR0FBRyxDQUNULG9DQUFvQyxFQUNwQyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUNwQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDL0QsT0FBTyxDQUFDLEdBQUcsQ0FDVCxrQ0FBa0MsRUFDbEMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FDcEMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FDVCx3QkFBd0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsY0FBYyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDakYsR0FBRyxDQUNKLEVBQUUsQ0FDSixDQUFDO0lBRUYsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGlicDJwIGZyb20gXCJsaWJwMnBcIjtcbmltcG9ydCBUQ1AgZnJvbSBcImxpYnAycC10Y3BcIjtcbmltcG9ydCBNcGxleCBmcm9tIFwibGlicDJwLW1wbGV4XCI7XG5pbXBvcnQgeyBOT0lTRSB9IGZyb20gXCJsaWJwMnAtbm9pc2VcIjtcbmltcG9ydCBTRUNJTyBmcm9tIFwibGlicDJwLXNlY2lvXCI7XG5pbXBvcnQgS2FkREhUIGZyb20gXCJsaWJwMnAta2FkLWRodFwiO1xuaW1wb3J0IFBlZXJJZCBmcm9tIFwicGVlci1pZFwiO1xuaW1wb3J0IEdvc3NpcHN1YiBmcm9tIFwibGlicDJwLWdvc3NpcHN1YlwiO1xuaW1wb3J0IEJvb3RzdHJhcCBmcm9tIFwibGlicDJwLWJvb3RzdHJhcFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUGVlcklkKGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgaWQgPSAoKGF3YWl0IFBlZXJJZC5jcmVhdGUoe1xuICAgIGJpdHM6IDIwNDgsXG4gICAga2V5VHlwZTogXCJyc2FcIixcbiAgfSBhcyBhbnkpKSBhcyB1bmtub3duKSBhcyBQZWVySWQ7XG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZW5hbWUsIEpTT04uc3RyaW5naWZ5KGlkLnRvSlNPTigpKSk7XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlID0gYXN5bmMgKGZpbGVuYW1lOiBzdHJpbmcsIHBvcnQ/OiBudW1iZXIpID0+IHtcbiAgY29uc3QgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSkudG9TdHJpbmcoKTtcbiAgY29uc3QgcGVlcklkID0gYXdhaXQgUGVlcklkLmNyZWF0ZUZyb21KU09OKEpTT04ucGFyc2UoY29udGVudCkpO1xuICAvL0B0cy1pZ25vcmVcbiAgY29uc3QgY2ZnOiBhbnkgPSB7XG4gICAgcGVlcklkLFxuICAgIGFkZHJlc3Nlczoge1xuICAgICAgbGlzdGVuOiBbYC9pcDQvMC4wLjAuMC90Y3AvJHtwb3J0IHx8IDB9YF0sXG4gICAgfSxcbiAgICBtb2R1bGVzOiB7XG4gICAgICB0cmFuc3BvcnQ6IFtUQ1BdLFxuICAgICAgc3RyZWFtTXV4ZXI6IFtNcGxleF0sXG4gICAgICBjb25uRW5jcnlwdGlvbjogW05PSVNFLCBTRUNJT10sXG4gICAgICBkaHQ6IEthZERIVCxcbiAgICAgIHB1YnN1YjogR29zc2lwc3ViLFxuICAgICAgcGVlckRpc2NvdmVyeTogW0Jvb3RzdHJhcF0sXG4gICAgfSxcbiAgICBjb25maWc6IHtcbiAgICAgIHBlZXJEaXNjb3Zlcnk6IHtcbiAgICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgICAgaW50ZXJ2YWw6IDEwZTMsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBsaXN0OiBbXG4gICAgICAgICAgICBcIi9kbnM0L2NvbW0tYS90Y3AvNjAwMC9wMnAvUW1hTUVhZndlM05jNjJ2YTFXVndmbjVNWjhycmNtUEpidmYzMTRac0UxclZGZFwiLFxuICAgICAgICAgICAgXCIvZG5zNC9jb21tLWIvdGNwLzYwMDAvcDJwL1FtWGI0Q1RmYjNhTjNWVnJhWkQ2c1o2TEdvdDhGRlNFeWQ1TmtQM2ZwUWZzZURcIixcbiAgICAgICAgICAgIFwiL2RuczQvY29tbS1jL3RjcC82MDAwL3AycC9RbVAxREZXRGMyaldpekpUa0pFYnl0WXdmUFdZeUJ2aXVzUWdqbVQzeG1vTjV6XCIsXG4gICAgICAgICAgICBcIi9kbnM0L2NvbW0tZC90Y3AvNjAwMC9wMnAvUW1lTVJRZHpYTm1MdEU1WkxlcThiRUxicGtuUlpYTERLd0phd2VGYm9iRUVXclwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZGh0OiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHJhbmRvbVdhbGs6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGludGVydmFsOiA2MGUzLFxuICAgICAgICAgIHRpbWVvdXQ6IDEwZTMsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3Qgbm9kZSA9IGF3YWl0IChMaWJwMnAgYXMgYW55KS5jcmVhdGUoY2ZnKTtcbiAgYXdhaXQgbm9kZS5zdGFydCgpO1xuXG4gIG5vZGUuY29ubmVjdGlvbk1hbmFnZXIub24oXCJwZWVyOmNvbm5lY3RcIiwgYXN5bmMgKGNvbm5lY3Rpb246IGFueSkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgXCJDT05ORUNUIENvbm5lY3Rpb24gZXN0YWJsaXNoZWQgdG86XCIsXG4gICAgICBjb25uZWN0aW9uLnJlbW90ZVBlZXIudG9CNThTdHJpbmcoKVxuICAgICk7XG4gIH0pO1xuICBub2RlLmNvbm5lY3Rpb25NYW5hZ2VyLm9uKFwicGVlcjpkaXNjb25uZWN0XCIsIChjb25uZWN0aW9uOiBhbnkpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIFwiRElTQ09OTkVDVCBDb25uZWN0aW9uIGNsb3NlZCB0bzpcIixcbiAgICAgIGNvbm5lY3Rpb24ucmVtb3RlUGVlci50b0I1OFN0cmluZygpXG4gICAgKTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFxuICAgIGBDcmVhdGVkIG5vZGUgd2l0aCBpZCAke25vZGUucGVlcklkLnRvQjU4U3RyaW5nKCl9IGFuZCBhZGRycyAke25vZGUubXVsdGlhZGRycy5qb2luKFxuICAgICAgXCIsXCJcbiAgICApfWBcbiAgKTtcblxuICByZXR1cm4gbm9kZTtcbn07XG4iXX0=