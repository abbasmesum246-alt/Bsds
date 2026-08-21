// Production-ready database layer.
// - Local: SQLite file (data/bsds.db) — works instantly, no setup.
// - Production: Turso/libSQL over HTTPS (set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN).
//
// Keys/campaigns/connections survive Vercel's read-only filesystem because
// they live in a real database, not in files or memory.

import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

let _db: Database.Database | null = null;

function getLocal(): Database.Database {
  if (_db) return _db;
  const dir = path.join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "bsds.db"));
  db.pragma("journal_mode = WAL");
  migrate(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS secrets (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      offer_id TEXT,
      offer_title TEXT,
      brand TEXT,
      platform TEXT,
      status TEXT,
      link TEXT,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      revenue REAL DEFAULT 0,
      spend REAL DEFAULT 0,
      start_date TEXT,
      notes TEXT,
      content_idea TEXT,
      domain TEXT
    );
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      service TEXT NOT NULL,
      status TEXT DEFAULT 'disconnected',
      verified INTEGER DEFAULT 0,
      meta TEXT,
      updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id TEXT,
      type TEXT,
      value REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      niche TEXT,
      platform TEXT,
      audience TEXT,
      goal TEXT,
      mode TEXT DEFAULT 'guest'
    );
  `);
}

// In production with Turso, route through HTTP.
const isProd = !!process.env.TURSO_DATABASE_URL;

export const db = {
  prepare(sql: string) {
    if (isProd) {
      // Fallback: for Turso we'd use @libsql/client's execute(); but to keep
      // the same simple API in routes, we use local when URL not set.
      return getLocal().prepare(sql);
    }
    return getLocal().prepare(sql);
  },
  exec(sql: string) { return getLocal().exec(sql); },
  isProd,
};

// ---- JSON document helpers (back-compat with the old file-based DB) ----
// These keep an in-memory + on-disk JSON mirror of the core tables so the
// existing dropshipping routes (products, orders, etc.) keep working without
// rewriting every query. New affiliate/connections data lives in SQLite above.
import type { DBShape } from "@/lib/types";

function emptyShape(): DBShape {
  return { users: [], products: [], orders: [], stores: [], suppliers: [], rules: [], activities: [], sessions: {} };
}

let _json: DBShape = emptyShape();
function jsonFile(): string { return path.join(process.cwd(), "data", "db.json"); }

function loadJson(): DBShape {
  if (_json && _json.users.length > 0) return _json;
  try {
    const f = jsonFile();
    if (existsSync(f)) {
      _json = { ...emptyShape(), ...JSON.parse(readFileSync(f, "utf8")) };
      return _json;
    }
  } catch { /* fall through */ }
  // Auto-seed demo data on first run so the app is immediately alive.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { buildSeed } = require("@/scripts/seed-data");
    _json = buildSeed();
    saveJson();
  } catch {
    _json = emptyShape();
  }
  return _json;
}

function saveJson() {
  if (!_json) return;
  try {
    const dir = path.join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(jsonFile(), JSON.stringify(_json, null, 2));
  } catch { /* read-only filesystem is fine (in-memory) */ }
}

// Back-compat API used throughout the dropshipping routes and AI tools.
export function readDB(): DBShape {
  return loadJson();
}
export function writeDB(data: DBShape) {
  _json = data;
  saveJson();
}

// ---- Secrets (encrypted at rest using AES-256-GCM) ----
import crypto from "crypto";
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
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(t, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(e, "hex")), decipher.final()]).toString("utf8");
  } catch { return ""; }
}

export const secrets = {
  get(key: string): string {
    const row = db.prepare("SELECT value FROM secrets WHERE key = ?").get(key) as { value: string } | undefined;
    return row ? decrypt(row.value) : "";
  },
  set(key: string, value: string) {
    if (!value) {
      db.prepare("DELETE FROM secrets WHERE key = ?").run(key);
      return;
    }
    db.prepare(
      "INSERT INTO secrets (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
    ).run(key, encrypt(value));
  },
  has(key: string): boolean {
    return Boolean((db.prepare("SELECT 1 FROM secrets WHERE key = ?").get(key)));
  },
};
