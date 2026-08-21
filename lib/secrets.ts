import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";

// Server-only storage of API keys. Keys are encrypted at rest with a key
// derived from BSDS_SECRET (or a machine-specific fallback) so they are never
// written in plain text. Never import this from a client component.

const FILE = path.join(process.cwd(), "data", "secrets.enc");
const MEM: Record<string, string> = {};
let cached: Record<string, string> | null = null;

function getKey(): Buffer {
  const secret = process.env.BSDS_SECRET || os.hostname() + "|bsds-default-secret-v1";
  return crypto.scryptSync(secret, "bsds-salt-v1", 32);
}

function resolveFile(): string | null {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return FILE;
  } catch {
    return null; // read-only filesystem (some serverless hosts)
  }
}

function load(): Record<string, string> {
  if (cached) return cached;
  const file = resolveFile();
  if (file && fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = JSON.parse(raw) as { iv: string; data: string };
      const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(parsed.iv, "hex"));
      const dec = Buffer.concat([decipher.update(Buffer.from(parsed.data, "hex")), decipher.final()]);
      const parsedData: Record<string, string> = JSON.parse(dec.toString("utf8"));
      cached = parsedData;
      return cached;
    } catch {
      cached = {};
      return cached;
    }
  }
  cached = MEM;
  return cached;
}

function save(obj: Record<string, string>) {
  cached = obj;
  const file = resolveFile();
  if (!file) return;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(obj), "utf8"), cipher.final()]);
  fs.writeFileSync(file, JSON.stringify({ iv: iv.toString("hex"), data: enc.toString("hex") }));
}

export function getSecret(key: string): string {
  return load()[key] || "";
}

export function setSecret(key: string, value: string) {
  const all = load();
  if (!value) delete all[key];
  else all[key] = value;
  save(all);
}

export function hasSecret(key: string): boolean {
  return Boolean(load()[key]);
}

// Return which integrations have keys configured (never the key itself).
export function getIntegrationStatus() {
  const s = load();
  return {
    groq: Boolean(s.GROQ_API_KEY),
    openai: Boolean(s.OPENAI_API_KEY),
    shopify: Boolean(s.SHOPIFY_STORE && s.SHOPIFY_ACCESS_TOKEN),
    cj: Boolean(s.CJ_API_KEY),
    aliexpress: Boolean(s.RAPIDAPI_KEY),
  };
}
