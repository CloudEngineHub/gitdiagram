import { createRequire } from "node:module";
import { stdin, stdout, stderr } from "node:process";

import DOMPurify from "dompurify";

const require = createRequire(import.meta.url);
let mermaidInstance = null;
let initialized = false;
let domPurifyPatched = false;

function ensureDomPurifyPatched() {
  if (domPurifyPatched) return;

  try {
    const domPurify = DOMPurify;
    if (typeof domPurify === "function" && typeof domPurify.sanitize !== "function") {
      const { JSDOM } = require("jsdom");
      const domWindow = new JSDOM("<!doctype html><html><body></body></html>").window;
      const domPurifyInstance = domPurify(domWindow);
      Object.assign(domPurify, domPurifyInstance);
    }
  } catch {
    // Best effort patch.
  } finally {
    domPurifyPatched = true;
  }
}

async function getMermaid() {
  if (mermaidInstance) return mermaidInstance;
  ensureDomPurifyPatched();
  const mermaidModule = await import("mermaid");
  mermaidInstance = mermaidModule.default;
  return mermaidInstance;
}

async function ensureMermaidInitialized() {
  const mermaid = await getMermaid();
  if (initialized) return mermaid;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
  });
  initialized = true;
  return mermaid;
}

async function readStdin() {
  let data = "";
  for await (const chunk of stdin) {
    data += chunk;
  }
  return data;
}

function normalizeError(error) {
  return {
    valid: false,
    message: error?.message || "Mermaid syntax is invalid and could not be parsed.",
    line: error?.hash?.line,
    token: error?.hash?.token,
    expected: error?.hash?.expected,
  };
}

async function main() {
  try {
    const diagram = (await readStdin()).toString();
    const mermaid = await ensureMermaidInitialized();
    await mermaid.parse(diagram);
    stdout.write(JSON.stringify({ valid: true }));
  } catch (error) {
    stdout.write(JSON.stringify(normalizeError(error)));
  }
}

main().catch((error) => {
  stderr.write(String(error?.message || error));
  process.exit(1);
});
