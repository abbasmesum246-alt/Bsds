import fs from "fs";
import path from "path";
import os from "os";
import { buildSeed } from "@/scripts/seed-data";
import type { DBShape } from "./types";

// Primary location (persists when running on your own computer).
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
// Fallback location for read-only hosting (e.g. Vercel's serverless).
const TMP_FILE = path.join(os.tmpdir(), "bsds-db.json");

const EMPTY: DBShape = {
  users: [], stores: [], suppliers: [], products: [],
  orders: [], rules: [], activities: [], sessions: {},
};

// In-memory mirror so the app keeps working even on read-only filesystems.
let memoryDB: DBShape = structuredClone(EMPTY);

function resolveFile(): string {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.accessSync(DATA_DIR, fs.constants.W_OK);
    return DB_FILE;
  } catch {
    return TMP_FILE;
  }
}

export function readDB(): DBShape {
  const file = resolveFile();
  try {
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, "utf-8"));
      memoryDB = { ...structuredClone(EMPTY), ...parsed };
      return memoryDB;
    }
  } catch {
    /* fall through */
  }
  if (memoryDB && memoryDB.users.length > 0) return memoryDB;
  // First run (e.g. on Vercel): seed with demo data so the app is alive.
  memoryDB = buildSeed();
  try { writeDB(memoryDB); } catch { /* read-only FS is fine */ }
  return memoryDB;
}

export function writeDB(db: DBShape) {
  memoryDB = db;
  try {
    fs.writeFileSync(resolveFile(), JSON.stringify(db, null, 2));
  } catch {
    // Keep in-memory copy if filesystem is read-only.
  }
}

export function mutate<T>(fn: (db: DBShape) => T): T {
  const db = readDB();
  const result = fn(db);
  writeDB(db);
  return result;
}
