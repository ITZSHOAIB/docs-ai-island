import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const required = ["dist/index.js", "dist/index.d.ts", "dist/styles.css", "LICENSE", "README.md"];

await Promise.all(required.map((file) => access(new URL(file, root))));

const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
if (packageJson.type !== "module") throw new Error("The package must remain ESM-only");
if (!packageJson.sideEffects?.includes("./dist/styles.css")) {
  throw new Error("The public stylesheet must be marked as a side effect");
}

const publicApi = await import(new URL("dist/index.js", root));
for (const name of ["mountDocsAiIsland", "defineConfig", "chatgpt", "claude"]) {
  if (typeof publicApi[name] !== "function") throw new Error(`Missing public export: ${name}`);
}

console.log("Package contents and SSR-safe import verified.");
