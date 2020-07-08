import { createNode } from "./createNode";
import fs from "fs";
(async () => {
  const filename = process.env.FILE;
  if (!filename) {
    return console.log("No filename, expected FILE env_var");
  }
  const node = await createNode(false);
  const json = node.peerId.toJSON();
  fs.writeFileSync(filename, JSON.stringify(json));
  node.stop();
})();
