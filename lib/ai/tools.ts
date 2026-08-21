import { readDB, writeDB } from "@/lib/db";
import type { SafeUser } from "@/lib/types";
import { makeId } from "@/lib/utils";

// Tools the AI assistant can call. Each returns a JSON-serialisable result.
// Every tool is scoped to the signed-in user.

export type ToolResult = { ok: boolean; message: string; data?: unknown };

type ToolDef = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  run: (args: Record<string, unknown>, user: SafeUser) => ToolResult;
};

function dbFor(user: SafeUser) {
  const db = readDB();
  return {
    db,
    save: () => writeDB(db),
    products: db.products.filter((p) => p.userId === user.id),
    orders: db.orders.filter((o) => o.userId === user.id),
    stores: db.stores.filter((s) => s.userId === user.id),
    suppliers: db.suppliers.filter((s) => s.userId === user.id),
    rules: db.rules.filter((r) => r.userId === user.id),
  };
}

export const TOOLS: ToolDef[] = [
  {
    name: "get_summary",
    description: "Get an overall business summary: revenue, profit, orders, top products, and urgent alerts.",
    parameters: { type: "object", properties: {} },
    run: (_args, user) => {
      const { orders, products } = dbFor(user);
      const valid = orders.filter((o) => o.status !== "cancelled");
      const revenue = valid.reduce((s, o) => s + o.total, 0);
      const profit = valid.reduce((s, o) => s + o.profit, 0);
      const pending = orders.filter((o) => o.status === "pending").length;
      const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 15).length;
      const oos = products.filter((p) => p.quantity === 0).length;
      const top = [...products]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3)
        .map((p) => ({ title: p.title, sold: p.sold, price: p.sellPrice }));
      return {
        ok: true,
        message: `Here is the summary.`,
        data: {
          revenue: Math.round(revenue * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          totalOrders: orders.length,
          pending, lowStock, outOfStock: oos,
          marginPct: revenue ? Math.round((profit / revenue) * 1000) / 10 : 0,
          topProducts: top,
        },
      };
    },
  },

  {
    name: "list_products",
    description: "List products. Optional filter by status (active/inactive/out_of_stock) and limit.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["active", "inactive", "out_of_stock"] },
        q: { type: "string", description: "text to search in title/sku" },
        limit: { type: "number", default: 10 },
      },
    },
    run: (args, user) => {
      let { products } = dbFor(user);
      if (args.status) products = products.filter((p) => p.status === args.status);
      if (args.q) {
        const q = String(args.q).toLowerCase();
        products = products.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      const limit = Number(args.limit) || 10;
      return {
        ok: true,
        message: `${products.length} product(s) found.`,
        data: products.slice(0, limit).map((p) => ({
          id: p.id, title: p.title, sku: p.sku, price: p.sellPrice, cost: p.costPrice,
          stock: p.quantity, sold: p.sold, status: p.status, margin: Math.round(((p.sellPrice - p.costPrice) / p.sellPrice) * 100),
        })),
      };
    },
  },

  {
    name: "update_price",
    description: "Update the sell price of a product by product id or title match. Returns the new margin.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string" },
        title: { type: "string", description: "used if productId missing" },
        newPrice: { type: "number", description: "new selling price" },
      },
      required: ["newPrice"],
    },
    run: (args, user) => {
      const ctx = dbFor(user);
      const p = ctx.db.products.find(
        (x) => x.userId === user.id && (x.id === args.productId || (args.title && x.title.toLowerCase().includes(String(args.title).toLowerCase())))
      );
      if (!p) return { ok: false, message: "Product not found." };
      const old = p.sellPrice;
      p.sellPrice = Number(args.newPrice);
      p.updatedAt = new Date().toISOString();
      ctx.save();
      const margin = Math.round(((p.sellPrice - p.costPrice) / p.sellPrice) * 100);
      return {
        ok: true,
        message: `Price of "${p.title}" changed from $${old} to $${p.sellPrice}. New margin: ${margin}%.`,
        data: { id: p.id, title: p.title, oldPrice: old, newPrice: p.sellPrice, margin },
      };
    },
  },

  {
    name: "set_product_status",
    description: "Activate, deactivate, or mark a product out of stock by id or title.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string" },
        title: { type: "string" },
        status: { type: "string", enum: ["active", "inactive", "out_of_stock", "monitoring"] },
      },
      required: ["status"],
    },
    run: (args, user) => {
      const ctx = dbFor(user);
      const p = ctx.db.products.find(
        (x) => x.userId === user.id && (x.id === args.productId || (args.title && x.title.toLowerCase().includes(String(args.title).toLowerCase())))
      );
      if (!p) return { ok: false, message: "Product not found." };
      p.status = args.status as typeof p.status;
      p.updatedAt = new Date().toISOString();
      ctx.save();
      return { ok: true, message: `"${p.title}" is now ${p.status.replace(/_/g, " ")}.` };
    },
  },

  {
    name: "list_orders",
    description: "List orders, optionally filtered by status.",
    parameters: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"] },
        limit: { type: "number", default: 10 },
      },
    },
    run: (args, user) => {
      let { orders } = dbFor(user);
      if (args.status) orders = orders.filter((o) => o.status === args.status);
      const limit = Number(args.limit) || 10;
      return {
        ok: true,
        message: `${orders.length} order(s).`,
        data: orders.slice(0, limit).map((o) => ({
          id: o.id, number: o.orderNumber, customer: o.customerName, total: o.total,
          profit: o.profit, status: o.status, date: o.createdAt,
        })),
      };
    },
  },

  {
    name: "fulfill_order",
    description: "Fulfill a pending order by its order number (e.g. #BSDS-100042). Generates a tracking number.",
    parameters: {
      type: "object",
      properties: { orderNumber: { type: "string" } },
      required: ["orderNumber"],
    },
    run: (args, user) => {
      const ctx = dbFor(user);
      const o = ctx.db.orders.find(
        (x) => x.userId === user.id && x.orderNumber.toLowerCase() === String(args.orderNumber).toLowerCase()
      );
      if (!o) return { ok: false, message: "Order not found." };
      if (o.status !== "pending") return { ok: false, message: `Order is ${o.status}, not pending — cannot fulfill.` };
      o.status = "shipped";
      o.fulfillment = "shipped";
      o.trackingNumber = `1Z${Math.floor(100000 + Math.random() * 899999)}${Math.floor(10 + Math.random() * 89)}`;
      o.sourceOrderId = `ALI${Math.floor(100000000 + Math.random() * 899999999)}`;
      o.updatedAt = new Date().toISOString();
      ctx.save();
      return {
        ok: true,
        message: `Order ${o.orderNumber} fulfilled. Tracking: ${o.trackingNumber}.`,
        data: { orderNumber: o.orderNumber, tracking: o.trackingNumber },
      };
    },
  },

  {
    name: "bulk_reprice",
    description: "Apply a multiplier (e.g. 1.1 = +10%) to all active products. Use for store-wide sales or inflation.",
    parameters: {
      type: "object",
      properties: { multiplier: { type: "number", description: "1.1 means +10%, 0.9 means -10%" } },
      required: ["multiplier"],
    },
    run: (args, user) => {
      const m = Number(args.multiplier);
      if (!m || m <= 0) return { ok: false, message: "Invalid multiplier." };
      const ctx = dbFor(user);
      let changed = 0;
      for (const p of ctx.db.products) {
        if (p.userId === user.id && p.status === "active") {
          p.sellPrice = Math.round(p.sellPrice * m * 100) / 100;
          p.updatedAt = new Date().toISOString();
          changed++;
        }
      }
      ctx.save();
      return { ok: true, message: `Repriced ${changed} active products by ${Math.round((m - 1) * 100)}%.` };
    },
  },

  {
    name: "create_product",
    description: "Create a new product in a store. Provide title, cost and desired margin percent.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        cost: { type: "number" },
        marginPercent: { type: "number", description: "target gross margin, e.g. 45" },
        category: { type: "string" },
      },
      required: ["title", "cost"],
    },
    run: (args, user) => {
      const ctx = dbFor(user);
      const store = ctx.stores[0];
      const supplier = ctx.suppliers[0];
      if (!store || !supplier) return { ok: false, message: "You need a store and supplier first." };
      const margin = (Number(args.marginPercent) || 45) / 100;
      const price = Math.round((Number(args.cost) / (1 - margin)) * 100) / 100;
      const now = new Date().toISOString();
      const p = {
        id: makeId("prd"), userId: user.id, storeId: store.id, supplierId: supplier.id,
        title: String(args.title), sku: `BSDS-${Date.now().toString(36).toUpperCase()}`,
        image: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='%23eef2ff'/><text x='50%' y='50%' font-size='140' text-anchor='middle' dominant-baseline='middle' fill='%233563ff'>${String(args.title)[0].toUpperCase()}</text></svg>`)}`,
        category: String(args.category || "General"),
        compareAtPrice: Math.round(price * 1.3 * 100) / 100,
        sellPrice: price, costPrice: Number(args.cost), quantity: 50, sold: 0, status: "active" as const,
        sourceUrl: `https://${supplier.url}/item/new`, tags: ["ai-created"],
        variants: 1, rating: 0, reviews: 0,
        priceMonitor: true, stockMonitor: true, autoReprice: false,
        createdAt: now, updatedAt: now,
      };
      ctx.db.products.push(p);
      store.productsCount = ctx.db.products.filter((x) => x.storeId === store.id).length;
      ctx.save();
      return {
        ok: true,
        message: `Created "${p.title}" at $${p.sellPrice} (${Math.round(margin * 100)}% margin).`,
        data: { id: p.id, title: p.title, price: p.sellPrice, margin: Math.round(margin * 100) },
      };
    },
  },
];

export function callTool(name: string, args: Record<string, unknown>, user: SafeUser): ToolResult {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) return { ok: false, message: `Unknown tool: ${name}` };
  try {
    return tool.run(args || {}, user);
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
