// Database entry point.
//
// SERVER code (API routes, server components) should import from "@/lib/db-server".
// This file exists so shared types and the auth flow can import readDB/writeDB
// without pulling Node-only modules (better-sqlite3, fs, crypto) into the browser.
//
// In the browser, these are in-memory stubs. Real data always flows through
// API routes which use the server implementation.

import type { DBShape } from "./types";

function emptyShape(): DBShape {
  return { users: [], products: [], orders: [], stores: [], suppliers: [], rules: [], activities: [], sessions: {} };
}

let _mem: DBShape = emptyShape();

export function readDB(): DBShape {
  return _mem;
}
export function writeDB(data: DBShape) {
  _mem = data;
}
