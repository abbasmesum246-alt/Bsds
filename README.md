# BSDS — Dropshipping Automation Platform

A full-stack, production-style dropshipping management app inspired by AutoDS:
product imports, automated order fulfillment, price/stock monitoring,
multi-store management, and an automation rules engine.

## Stack
- **Next.js 14** (App Router, Server Components, Route Handlers)
- **TypeScript** · **Tailwind CSS** · **Recharts** · **lucide-react**
- **bcryptjs** auth with httpOnly cookie sessions
- File-based persistent JSON database (`data/db.json`) — no external DB required
- **PWA** with manifest, service worker and installable icons
- Play Store–ready (Bubblewrap/TWA build script in `play-store/`)

## Quick start
```bash
npm install
npm run dev          # http://localhost:3000
```
The database seeds automatically on first load with realistic demo data.

**Demo login:** `demo@bsds.app` / `password123`

Or register a new account — it creates a starter store & supplier.

## Features
- Authentication (register/login/logout, bcrypt, sessions)
- Dashboard with revenue/profit KPIs, charts, top products, store performance
- Products — search, filter, table/grid views, CRUD, import-by-URL, price/stock monitors, optimistic updates
- Orders — search, status tabs, detail drawer, one-click fulfillment with tracking numbers, manual order creation
- Stores — connect Shopify/eBay/Wix/Amazon/WooCommerce/Etsy/Facebook
- Suppliers — ratings, shipping windows, auto-ordering toggles
- Automations — if-this-then-that rules (reprice, reorder, notify)
- Settings — profile, password, notifications, billing, mobile install
- Installable PWA + Google Play AAB build script
- Fully responsive with empty/loading states and toasts

## Build for production
```bash
npm run build
npm start
```

## Google Play
See [`play-store/README.md`](play-store/README.md) for instructions to build a
signed, uploadable Android App Bundle.
