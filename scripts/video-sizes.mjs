// Records the size of each file in public/video for the Worker (worker/index.ts), which needs it to
// answer byte-range requests when the asset store doesn't report a Content-Length. Runs with every build.
import { readdirSync, statSync, writeFileSync } from "node:fs";

const dir = new URL("../public/video/", import.meta.url);
const sizes = Object.fromEntries(
  readdirSync(dir)
    .filter((f) => !f.startsWith("."))
    .sort()
    .map((f) => [`/video/${f}`, statSync(new URL(f, dir)).size]),
);
writeFileSync(new URL("../worker/video-sizes.json", import.meta.url), JSON.stringify(sizes, null, 2) + "\n");
console.log("video sizes:", sizes);
