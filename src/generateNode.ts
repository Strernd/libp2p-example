import { createPeerId } from "./createNode";

const fileAdd = process.env.FILEADD;
const filename = `./peerId${fileAdd}.json`;

createPeerId(filename);
