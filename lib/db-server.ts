// SERVER-ONLY database code. Never import this from a client component.
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import crypto from "crypto";
import type { DBShape } from "./types";

// ---- SQLite (for secrets/connections/campaigns) ----
let _db: Database.Database | null = null;

function getLocal(): Database.Database {
  if (_db) return _db;
  const dir = path.join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "bsds.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS secrets (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS campaigns (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, offer_id TEXT, offer_title TEXT, brand TEXT, platform TEXT, status TEXT, link TEXT, clicks INTEGER DEFAULT 0, conversions INTEGER DEFAULT 0, revenue REAL DEFAULT 0, spend REAL DEFAULT 0, start_date TEXT, notes TEXT, content_idea TEXT, domain TEXT);
    CREATE TABLE IF NOT EXISTS connections (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, service TEXT NOT NULL, status TEXT DEFAULT 'disconnected', verified INTEGER DEFAULT 0, meta TEXT, updated_at TEXT);
    CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, campaign_id TEXT, type TEXT, value REAL DEFAULT 0, created_at TEXT DEFAULT (datetime('now')));
  `);
  _db = db;
  return db;
}

export const db = {
  prepare: (sql: string) => getLocal().prepare(sql),
  exec: (sql: string) => getLocal().exec(sql),
};

// ---- JSON document store (back-compat with products/orders/etc) ----
function emptyShape(): DBShape {
  return { users: [], products: [], orders: [], stores: [], suppliers: [], rules: [], activities: [], sessions: {} };
}

let _json: DBShape = emptyShape();
const jsonFile = path.join(process.cwd(), "data", "db.json");

function loadJson(): DBShape {
  if (_json.users.length > 0) return _json;
  try {
    if (existsSync(jsonFile)) {
      _json = { ...emptyShape(), ...JSON.parse(readFileSync(jsonFile, "utf8")) };
      if (_json.users.length > 0) return _json;
    }
  } catch { /* fall through to seed */ }
  // First run: seed demo data
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { buildSeed } = require("../scripts/seed-data");
    _json = buildSeed();
    saveJson();
  } catch {
    _json = emptyShape();
  }
  return _json;
}

function saveJson() {
  try {
    const dir = path.join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(jsonFile, JSON.stringify(_json, null, 2));
  } catch { /* read-only */ }
}

export function readDB(): DBShape {
  return loadJson();
}
export function writeDB(data: DBShape) {
  _json = data;
  saveJson();
}

// ---- Encrypted secrets ----
const ENC_KEY = process.env.BSDS_SECRET
  ? crypto.scryptSync(process.env.BSDS_SECRET, "bsds", 32)
  : crypto.scryptSync("bsds-local-dev-secret", "bsds-salt", 32);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({ iv: iv.toString("hex"), e: enc.toString("hex"), t: tag.toString("hex") });
}
function decrypt(payload: string): string {
  try {
    const { iv, e, t } = JSON.parse(payload);
    const d = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, Buffer.from(iv, "hex"));
    d.setAuthTag(Buffer.from(t, "hex"));
    return Buffer.concat([d.update(Buffer.from(e, "hex")), d.final()]).toString("utf8");
  } catch { return ""; }
}

export const secrets = {
  get(key: string): string {
    const row = db.prepare("SELECT value FROM secrets WHERE key = ?").get(key) as { value: string } | undefined;
    return row ? decrypt(row.value) : "";
  },
  set(key: string, value: string) {
    if (!value) { db.prepare("DELETE FROM secrets WHERE key = ?").run(key); return; }
    db.prepare("INSERT INTO secrets (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')").run(key, encrypt(value));
  },
  has(key: string): boolean {
    return Boolean(db.prepare("SELECT 1 FROM secrets WHERE key = ?").get(key));
  },
};
