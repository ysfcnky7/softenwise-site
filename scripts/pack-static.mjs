/** Copy public static files to dist/ — never ship node_modules or tooling. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDirectRun } from "./lib/cli.mjs";

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIR = new Set([
  "node_modules",
  ".git",
  ".github",
  ".cursor",
  ".gemini",
  ".netlify",
  ".wrangler",
  ".vercel",
  "scripts",
  "tests",
  "docs",
  "partials",
  "coverage",
  "dist",
  "pack",
]);

const SKIP_FILE = new Set([
  "package.json",
  "package-lock.json",
  "netlify.toml",
  "wrangler.toml",
  "bitbucket-pipelines.yml",
  ".gitignore",
  ".assetsignore",
  ".nvmrc",
  ".env",
]);

function skipName(name) {
  if (SKIP_DIR.has(name) || SKIP_FILE.has(name)) return true;
  if (name.startsWith(".env.")) return true;
  if (name.endsWith(".md") && !["README.md", "LICENSE", "SECURITY.md", "humans.txt"].includes(name)) {
    return true;
  }
  return false;
}

export function packStatic(root = DEFAULT_ROOT) {
  const dest = path.join(root, "dist");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(root, { withFileTypes: true });
  const copied = [];
  for (const ent of entries) {
    if (skipName(ent.name)) continue;
    const from = path.join(root, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      fs.cpSync(from, to, { recursive: true });
    } else if (ent.isFile()) {
      fs.copyFileSync(from, to);
    } else {
      continue;
    }
    copied.push(ent.name);
  }

  if (fs.existsSync(path.join(dest, "node_modules"))) {
    throw new Error("pack-static: node_modules leaked into dist/");
  }
  return { dest, copied };
}

/* c8 ignore next 5 */
if (isDirectRun(import.meta.url)) {
  const { dest, copied } = packStatic();
  console.log("packed", dest);
  console.log(copied.sort().join("\n"));
}
