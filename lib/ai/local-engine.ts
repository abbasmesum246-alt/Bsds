// Built-in BSD AI engine — works with ZERO API keys.
// It understands common business questions, reads the user's real data,
// and can run the same automation tools as the cloud LLM. If a Groq/OpenAI
// key is added later, the chat route uses that instead.

import { readDB } from "@/lib/db-server";
import { callTool, type ToolResult } from "./tools";
import type { SafeUser } from "@/lib/types";

interface Ctx {
  user: SafeUser;
  products: ReturnType<typeof getProducts>;
  orders: ReturnType<typeof getOrders>;
}

function getProducts(userId: string) {
  return readDB().products.filter((p) => p.userId === userId);
}
function getOrders(userId: string) {
  return readDB().orders.filter((o) => o.userId === userId);
}

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function num(x: string) {
  const n = parseFloat(x.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

// Run a tool and format a one-line confirmation.
function run(user: SafeUser, name: string, args: Record<string, unknown>): { result: ToolResult; text: string } {
  const result = callTool(name, args, user);
  return { result, text: result.message };
}

export function localAI(question: string, user: SafeUser): string {
  const q = question.trim().toLowerCase();
  const products = getProducts(user.id);
  const orders = getOrders(user.id).filter((o) => o.status !== "cancelled");
  const ctx: Ctx = { user, products, orders };

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const profit = orders.reduce((s, o) => s + o.profit, 0);
  const marginPct = revenue ? Math.round((profit / revenue) * 100) : 0;
  const pending = orders.filter((o) => o.status === "pending").length;
  const active = products.filter((p) => p.status === "active");
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity < 15);
  const outOfStock = products.filter((p) => p.quantity === 0);

  // ---------- ACTION INTENTS (actually do things) ----------

  // "change/set price of X to $Y" / "reprice X to Y"
  const priceMatch =
    q.match(/(?:change|set|update|make|reprice|put).{0,20}(?:price of|price for)?\s*(.+?)\s+(?:to|at)\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/(.+?)\s+(?:price (?:to|at)|for)\s*\$?\s*(\d+(?:\.\d+)?)/);
  if ((q.includes("price") || q.includes("reprice") || q.includes("cost")) && /\d/.test(q) && priceMatch) {
    const target = priceMatch[1].replace(/^(the|price of|price for|change|set|update)\s+/, "").trim();
    const newPrice = num(priceMatch[2]);
    if (target && newPrice && !/^how|^what|^why|^when|^can you|^should/.test(target)) {
      const { text } = run(user, "update_price", { title: target, newPrice });
      return `✅ ${text}`;
    }
  }

  // "fulfill / mark BSDS-100042 shipped" (order number) OR an ord_ id
  const fulfillMatch =
    q.match(/(bsds-?\d+)/i) ||
    q.match(/(ord_[a-z0-9-]+)/i) ||
    q.match(/(?:fulfill|fulfil|ship|mark)\s*(?:order)?\s*#?\s*(\d{4,6})/i);
  if (fulfillMatch && /fulfill|fulfil|ship|mark/.test(q)) {
    const { result, text } = run(user, "fulfill_order", { orderNumber: fulfillMatch[1].toUpperCase() });
    // If not found by the provided ref, give a friendly hint rather than confusing "not found"
    if (!result.ok && /not found/i.test(text)) {
      return "I couldn't find that order. Say \"list orders\" to see your recent order numbers, then try e.g. \"fulfill BSDS-100042\". Note: only pending orders can be fulfilled.";
    }
    return `✅ ${text}`;
  }

  // "create product T cost $C margin M%"
  if (/^(create|add|new)\s/.test(q) && /product/.test(q) && /cost|\$/.test(q)) {
    const costMatch = q.match(/cost\s*\$?\s*(\d+(?:\.\d+)?)/) || q.match(/\$\s*(\d+(?:\.\d+)?)/);
    const marginMatch = q.match(/(\d{1,3})\s*%\s*margin/) || q.match(/margin\s*(\d{1,3})/);
    const title = question
      .replace(/^(create|add|new)\s+(a\s+)?(product\s+)?/i, "")
      .replace(/cost\s*\$?\s*\d+(?:\.\d+)?/i, "")
      .replace(/(with\s+)?\d{1,3}\s*%\s*margin/i, "")
      .replace(/[.$]/g, "")
      .trim();
    const cost = costMatch ? num(costMatch[1]) : NaN;
    if (title && cost) {
      const { text } = run(user, "create_product", {
        title, cost, marginPercent: marginMatch ? num(marginMatch[1]) : 45,
      });
      return `✅ ${text}`;
    }
  }

  // "bulk reprice +X%"
  const bulkMatch = q.match(/bulk.{0,10}reprice.{0,10}(-?\d+(?:\.\d+)?)\s*%/);
  if (bulkMatch) {
    const { text } = run(user, "bulk_reprice", { percent: num(bulkMatch[1]) });
    return `✅ ${text}`;
  }

  // ---------- DATA QUESTIONS ----------
  if (/^(hi|hello|hey|salam|assalam|good (morning|evening|afternoon))\b/.test(q)) {
    return `Hi ${user.name?.split(" ")[0] || "there"} 👋 I'm your BSD business assistant. I can analyze your numbers and take actions — try:\n• "Give me a summary"\n• "What's my profit margin?"\n• "Show me low stock products"\n• "Change the price of Yoga Mat to $29"\n• "Create a product Wireless Earbuds cost $12 with 50% margin"`;
  }

  if (/summary|how('?s| is) (my|the) (business|store) doing|overview|dashboard|how are (sales|things)|snapshot/.test(q)) {
    const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);
    const lines = [
      `📊 **Your business snapshot**`,
      `• Revenue (30d): **${money(revenue)}**`,
      `• Net profit: **${money(profit)}** (${marginPct}% margin)`,
      `• Orders: **${orders.length}** — ${pending} pending fulfillment`,
      `• Active products: **${active.length}**`,
    ];
    if (lowStock.length) lines.push(`• ⚠️ Low stock: ${lowStock.length} product(s)`);
    if (outOfStock.length) lines.push(`• 🛑 Out of stock: ${outOfStock.length} product(s)`);
    if (top.length) lines.push(`\n🏆 Top sellers: ${top.map((p) => `${p.title} (${p.sold} sold)`).join("; ")}`);
    if (marginPct < 15 && revenue > 0) lines.push(`\n💡 Your margin is under 15%. Consider raising prices or switching to lower-cost suppliers.`);
    return lines.join("\n");
  }

  if (/profit|margin|how much (do|am) i (make|earn|losing)|net|earning/.test(q)) {
    if (revenue === 0) return "You don't have any completed orders yet, so there's no profit to show. Add products and drive your first sales!";
    const avgOrder = orders.length ? revenue / orders.length : 0;
    return [
      `💰 **Profit breakdown**`,
      `• Revenue: ${money(revenue)}`,
      `• Net profit: ${money(profit)}`,
      `• Overall margin: **${marginPct}%**`,
      `• Average order value: ${money(avgOrder)}`,
      marginPct >= 30 ? "✅ Healthy margin — keep it up." : marginPct >= 15 ? "⚠️ Decent margin. Aim for 30%+ by trimming ad costs or raising prices 5–10%." : "🛑 Low margin. You're at risk if ad costs rise. Reprice winners higher and cut losers.",
    ].join("\n");
  }

  if (/low stock|out of stock|inventory|stock|reorder/.test(q)) {
    if (!lowStock.length && !outOfStock.length) return "✅ All products are well stocked. No reordering needed right now.";
    const lines = ["📦 **Stock alerts**"];
    if (outOfStock.length) lines.push("🛑 Out of stock:", ...outOfStock.map((p) => `• ${p.title} — reorder now`));
    if (lowStock.length) lines.push("⚠️ Low stock (<15):", ...lowStock.map((p) => `• ${p.title} — ${p.quantity} left`));
    return lines.join("\n");
  }

  if (/product|catalog|inventory/.test(q) && /show|list|what|how many|top|best/.test(q)) {
    const { result } = run(user, "list_products", { limit: 10 });
    const list = (result.data as Array<Record<string, unknown>>) || [];
    if (!list.length) return "No products yet. Say \"create a product Leather Wallet cost $8 with 50% margin\" and I'll add one.";
    return "🛍️ **Your products**\n" + list.map((p) => `• ${p.title} — ${money(Number(p.price))} (stock ${p.stock})`).join("\n");
  }

  if (/order/.test(q) && /show|list|pending|recent|fulfill/.test(q)) {
    const { result } = run(user, "list_orders", { limit: 8 });
    const list = (result.data as Array<Record<string, unknown>>) || [];
    if (!list.length) return "No orders yet.";
    return "🧾 **Recent orders**\n" + list.map((o) => `• ${o.number || "#" + o.id} — ${money(Number(o.total))} — ${o.status}`).join("\n");
  }

  if (/affiliate/.test(q)) {
    return [
      "🤝 **Affiliate starter advice**",
      "1. Pick ONE niche you know (tech, fitness, finance, beauty).",
      "2. Join 2–3 networks from the Networks page (Amazon Associates, Impact, ShareASale).",
      "3. Build helpful content (reviews/comparisons) — trust converts, not hype.",
      "4. Use the Offers page to find high-commission programs.",
      "5. Track clicks & EPC in Campaigns; double down on what converts.",
      "💡 Recurring-commission SaaS products pay every month — prioritize them.",
    ].join("\n");
  }

  if (/supplier|alixpress|cj dropship|sourcing/.test(q)) {
    return [
      "🚚 **Finding good suppliers**",
      "• Use the Best Suppliers page — they're scored on price, shipping and rating.",
      "• Order samples before scaling; never judge by photos alone.",
      "• Prefer suppliers with 4.7★+, 2+ years, and ePacket/USPS shipping.",
      "• Have 2 suppliers per winning product to avoid stockouts.",
    ].join("\n");
  }

  if (/price|pricing|how much (should|to)|markup/.test(q)) {
    return [
      "💲 **Smart pricing rule of thumb**",
      "• Sell price = cost ÷ (1 − target margin). Example: $10 cost at 50% margin → $20.",
      "• Add shipping + ~10% for ads/fees on top.",
      "• End prices in .99 or .95 — they convert better.",
      "• Set compare-at price ~30% higher to show a discount.",
      "I can price for you: just say \"create a product <name> cost $X with Y% margin\".",
    ].join("\n");
  }

  if (/ad|facebook|tiktok|marketing|traffic|scale/.test(q)) {
    return [
      "📈 **Scaling with ads**",
      "• Test 3–5 creatives at $10–20/day; kill what doesn't get add-to-cart in 3 days.",
      "• Keep ROAS above 2.5 (you need it to cover product + shipping + fees).",
      "• Scale winners by 20% budget every 2–3 days, not all at once.",
      "• A high-ticket or recurring-commission product needs far fewer sales to profit.",
    ].join("\n");
  }

  // ---------- FALLBACK ----------
  return [
    `I'm BSD's built-in assistant — here even without an API key. I can read your data and take actions. Try asking:`,
    `• "Give me a summary"`,
    `• "What's my profit margin?"`,
    `• "Show low stock products"`,
    `• "Change the price of <product> to $29"`,
    `• "Create a product Wireless Earbuds cost $12 with 50% margin"`,
    `• "How do I price products?"`,
    `\nFor open-ended, web-powered analysis, add a free Groq key in Settings → Integrations (optional).`,
  ].join("\n");
}
