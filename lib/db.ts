import fs from "fs";
import path from "path";
import type { DBShape } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

const EMPTY: DBShape = {
  users: [], stores: [], suppliers: [], products: [],
  orders: [], rules: [], activities: [], sessions: {},
};

export function readDB(): DBShape {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY, null, 2));
    return structuredClone(EMPTY);
  }
  try {
    return { ...structuredClone(EMPTY), ...JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) };
  } catch {
    return structuredClone(EMPTY);
  }
}

export function writeDB(db: DBShape) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function mutate<T>(fn: (db: DBShape) => T): T {
  const db = readDB();
  const result = fn(db);
  writeDB(db);
  return result;
}
