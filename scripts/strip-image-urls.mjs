import { readFileSync, writeFileSync } from "fs";

const filePath = new URL("../lib/meditations-data.ts", import.meta.url).pathname;
let content = readFileSync(filePath, "utf-8");

// Remove all imageUrl lines that have guessed wp-content paths
content = content.replace(
  /\s+imageUrl: "https:\/\/shaktianandama\.com\/wp-content\/uploads\/[^"]+",?\n/g,
  "\n"
);

writeFileSync(filePath, content, "utf-8");
console.log("Done: removed all guessed imageUrl lines from meditations-data.ts");
