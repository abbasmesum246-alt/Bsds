import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// Real dropshipping business metrics with standard formulas used by
// sellers on Shopify/eBay/Amazon. Each metric includes a plain-language
// explanation so the dashboard doubles as a training tool.
export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  const uid = auth.user.id;

  const products = db.products.filter((p) => p.userId === uid);
  const orders = db.orders.filter((o) => o.userId === uid);

  const valid = orders.filter((o) => o.status !== "cancelled");
  const returned = orders.filter((o) => o.status === "returned");
  const paid = orders.filter((o) => o.status !== "cancelled");

  // ---- Money in / out ----
  const grossRevenue = paid.reduce((s, o) => s + o.total, 0);
  const discounts = 0; // demo field
  const shippingCharged = paid.reduce((s, o) => s + o.shipping, 0);
  const netRevenue = grossRevenue - discounts;

  // Cost of goods sold (what you pay supplier for products)
  const cogs = paid.reduce((s, o) => s + o.items.reduce((x, i) => x + i.costPrice * i.quantity, 0), 0);

  // Real payment processor fee (Stripe/PayPal ~2.9% + $0.30)
  const paymentFees = paid.reduce((s, o) => s + o.total * 0.029 + 0.3, 0);
  // Your shipping cost to customer (approx supplier shipping per order)
  const shippingCost = paid.reduce((s, o) => s + 3.99, 0);
  // Ad spend is the big one in dropshipping — here shown as an editable
  // placeholder (25% of revenue is a realistic learning benchmark).
  const adSpend = netRevenue * 0.25;
  // Platform fees (eBay/Amazon ~10%, Shopify has no per-sale fee but apps)
  const platformFees = netRevenue * 0.05;
  // Refunds lost value
  const refunds = returned.reduce((s, o) => s + o.total, 0);

  const totalCosts = cogs + shippingCost + paymentFees + adSpend + platformFees + refunds;
  const netProfit = netRevenue - totalCosts;

  // ---- Ratios ----
  const grossProfit = netRevenue - cogs;
  const grossMargin = netRevenue ? (grossProfit / netRevenue) * 100 : 0;
  const netMargin = netRevenue ? (netProfit / netRevenue) * 100 : 0;
  const markup = cogs ? ((netRevenue - cogs) / cogs) * 100 : 0;

  const orderCount = paid.length;
  const aov = orderCount ? netRevenue / orderCount : 0; // average order value
  const unitsSold = paid.reduce((s, o) => s + o.items.reduce((x, i) => x + i.quantity, 0), 0);

  const conversionRate = 2.4; // % visitors -> buyers (demo benchmark)
  const visitors = conversionRate ? Math.round(orderCount / (conversionRate / 100)) : 0;
  const cpc = visitors ? adSpend / visitors : 0; // cost per click
  const cac = orderCount ? adSpend / orderCount : 0; // customer acquisition cost
  const roas = adSpend ? netRevenue / adSpend : 0; // return on ad spend
  const ltv = aov * 1.8; // lifetime value (demo: customer buys 1.8x on avg)

  const refundRate = orders.length ? (returned.length / orders.length) * 100 : 0;
  const fulfillmentRate = orders.length ? (paid.filter((o) => o.fulfillment === "delivered" || o.fulfillment === "shipped").length / orders.length) * 100 : 0;

  // Break-even: how many sales cover fixed costs ($99/mo plan + tools),
  // using GROSS profit per order (the money left after product cost).
  const monthlyFixed = 129;
  const grossPerOrder = orderCount ? grossProfit / orderCount : 0;
  const breakEvenOrders = grossPerOrder > 0 ? Math.ceil(monthlyFixed / grossPerOrder) : 0;

  // Product-level profit insights
  const productStats = products.map((p) => {
    const productOrders = paid.filter((o) => o.items.some((i) => i.productId === p.id));
    const sold = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((x, i) => x + i.quantity, 0), 0);
    const rev = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((x, i) => x + i.sellPrice * i.quantity, 0), 0);
    const cost = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((x, i) => x + i.costPrice * i.quantity, 0), 0);
    const margin = p.sellPrice ? ((p.sellPrice - p.costPrice) / p.sellPrice) * 100 : 0;
    return {
      id: p.id, title: p.title, image: p.image, sold,
      revenue: Math.round(rev * 100) / 100, profit: Math.round((rev - cost) * 100) / 100,
      margin: Math.round(margin), status: p.status, stock: p.quantity,
      health:
        margin >= 40 && sold >= 5 ? "winner" :
        margin < 15 ? "kill" :
        sold === 0 ? "test" : "ok",
    };
  });
  const winners = productStats.filter((p) => p.health === "winner").length;
  const losers = productStats.filter((p) => p.health === "kill").length;

  return NextResponse.json({
    summary: {
      grossRevenue: round2(grossRevenue),
      netRevenue: round2(netRevenue),
      cogs: round2(cogs),
      grossProfit: round2(grossProfit),
      grossMargin: round2(grossMargin),
      adSpend: round2(adSpend),
      paymentFees: round2(paymentFees),
      platformFees: round2(platformFees),
      shippingCost: round2(shippingCost),
      refunds: round2(refunds),
      netProfit: round2(netProfit),
      netMargin: round2(netMargin),
      markup: round2(markup),
    },
    operations: {
      orders: orderCount,
      unitsSold,
      aov: round2(aov),
      refundRate: round2(refundRate),
      fulfillmentRate: round2(fulfillmentRate),
      breakEvenOrders,
      monthlyFixed,
    },
    marketing: {
      visitors,
      conversionRate,
      cpc: round2(cpc),
      cac: round2(cac),
      roas: round2(roas),
      ltv: round2(ltv),
      adSpend: round2(adSpend),
    },
    insights: {
      winners,
      losers: productStats.filter((p) => p.health === "kill").length,
      untested: productStats.filter((p) => p.health === "test").length,
      advice: buildAdvice({ netMargin, roas, refundRate, aov, cac, ltv, winners, losers }),
    },
    products: productStats.sort((a, b) => b.profit - a.profit).slice(0, 10),
    glossary: GLOSSARY,
  });
}

function round2(n: number) { return Math.round(n * 100) / 100; }

function buildAdvice(m: { netMargin: number; roas: number; refundRate: number; aov: number; cac: number; ltv: number; winners: number; losers: number }) {
  const tips: string[] = [];
  if (m.netMargin < 15) tips.push("Your net margin is below 15% — raise prices, cut losing ads, or negotiate a lower supplier cost.");
  else if (m.netMargin >= 25) tips.push("Strong net margin above 25% — reinvest profit into your winning products.");
  if (m.roas < 2) tips.push("ROAS is under 2.0 — your ads aren't paying for themselves yet. Test new videos or audiences.");
  else if (m.roas >= 3) tips.push("Healthy ROAS above 3.0 — you can safely increase ad budget.");
  if (m.refundRate > 8) tips.push("Refund rate over 8% is too high — check product quality, shipping times, and product descriptions.");
  if (m.ltv < m.cac * 2) tips.push("LTV is less than 2× your ad cost — add upsells/cross-sells so each customer is worth more.");
  if (m.losers > 0) tips.push(`${m.losers} product(s) have thin margins — consider dropping or repricing them.`);
  if (m.winners > 0) tips.push(`${m.winners} winning product(s) found — push more ad budget behind them.`);
  if (tips.length === 0) tips.push("Numbers look healthy. Keep testing new creatives and watch your refund rate.");
  return tips;
}

const GLOSSARY = [
  { term: "Gross Revenue", formula: "all money customers paid", why: "The top number — looks exciting but isn't your money yet." },
  { term: "COGS", formula: "supplier cost × quantity", why: "Cost of Goods Sold — what the product actually costs you." },
  { term: "Gross Margin", formula: "(Revenue − COGS) ÷ Revenue × 100", why: "Aim for 40%+ in dropshipping. Below 20% is risky." },
  { term: "Net Profit", formula: "Revenue − ALL costs", why: "The real money you keep. This is the only number that matters long-term." },
  { term: "AOV", formula: "Revenue ÷ orders", why: "Average Order Value — raise it with upsells and bundles." },
  { term: "Conversion Rate", formula: "orders ÷ visitors × 100", why: "% of visitors who buy. 2% is average; 3%+ is good." },
  { term: "CAC", formula: "ad spend ÷ orders", why: "Customer Acquisition Cost — what you pay to get one buyer." },
  { term: "LTV", formula: "avg customer lifetime spend", why: "Must be higher than CAC or you lose money." },
  { term: "ROAS", formula: "Revenue ÷ ad spend", why: "Return on ad spend. 2.0 = break-even, 3.0+ = scale up." },
  { term: "Break-even", formula: "fixed costs ÷ profit per order", why: "Sales needed just to cover your monthly bills." },
  { term: "Refund Rate", formula: "refunds ÷ total orders × 100", why: "Under 5% is good; over 10% means a product problem." },
  { term: "Markup", formula: "(price − cost) ÷ cost × 100", why: "How much you multiply supplier cost. 2× = 100% markup." },
];
