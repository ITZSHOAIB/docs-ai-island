import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "fixtures/html");
const target = resolve(root, ".tmp/html-packed");
const packageDirectory = resolve(root, ".package");
const tarballName = readdirSync(packageDirectory).find((file) => file.endsWith(".tgz"));

if (!tarballName) throw new Error("Expected a packed docs-ai-island tarball");

mkdirSync(target, { recursive: true });
cpSync(source, target, {
  recursive: true,
  filter: (path) =>
    !path.includes("node_modules") && !path.includes("/dist") && !path.includes("test-results"),
});

const manifestPath = resolve(target, "package.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.dependencies["docs-ai-island"] = `file:${resolve(packageDirectory, tarballName)}`;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

execFileSync(
  "pnpm",
  ["install", "--ignore-workspace", "--prefer-offline", "--lockfile=false", "--ignore-scripts"],
  {
    cwd: target,
    stdio: "inherit",
  },
);
execFileSync("pnpm", ["typecheck"], { cwd: target, stdio: "inherit" });
execFileSync("pnpm", ["build"], { cwd: target, stdio: "inherit" });

console.log("Plain HTML fixture built successfully from the packed tarball.");
