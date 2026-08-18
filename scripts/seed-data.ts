import type { DBShape, User, Store, Supplier, Product, Order, AutomationRule, Activity, Platform, OrderStatus } from "../lib/types";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260818);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const round2 = (n: number) => Math.round(n * 100) / 100;

const PLATFORMS: Platform[] = ["Shopify", "eBay", "Wix", "Facebook Marketplace", "WooCommerce", "Etsy"];

const CATALOG: Record<string, { title: string; cost: number; emoji: string }[]> = {
  Electronics: [
    { title: "Wireless Noise-Cancelling Earbuds Pro", cost: 18.5, emoji: "🎧" },
    { title: "Smart Fitness Watch with Heart Rate Monitor", cost: 24.0, emoji: "⌚" },
    { title: "Portable Bluetooth Speaker 20W", cost: 15.75, emoji: "🔊" },
    { title: "USB-C Fast Charging Hub 7-in-1", cost: 12.3, emoji: "🔌" },
    { title: "Magnetic Wireless Charger Pad", cost: 6.9, emoji: "🧲" },
    { title: "Mini LED Projector 1080p", cost: 42.0, emoji: "📽️" },
    { title: "Mechanical RGB Gaming Keyboard", cost: 28.5, emoji: "⌨️" },
    { title: "Ultra-Light Wireless Gaming Mouse", cost: 14.2, emoji: "🖱️" },
  ],
  Home: [
    { title: "Aromatherapy Essential Oil Diffuser", cost: 9.8, emoji: "🌿" },
    { title: "Smart LED Strip Lights 5m WiFi", cost: 7.4, emoji: "💡" },
    { title: "Memory Foam Neck Pillow Travel Set", cost: 5.6, emoji: "🛏️" },
    { title: "Stainless Steel Insulated Water Bottle", cost: 4.9, emoji: "🍶" },
    { title: "Cordless Handheld Vacuum Cleaner", cost: 22.0, emoji: "🧹" },
    { title: "Electric Milk Frother & Steamer", cost: 16.3, emoji: "🥛" },
  ],
  Beauty: [
    { title: "Jade Roller & Gua Sha Beauty Set", cost: 3.8, emoji: "💆" },
    { title: "LED Light Therapy Face Mask", cost: 19.5, emoji: "✨" },
    { title: "Hair Scalp Massager Shampoo Brush", cost: 2.1, emoji: "🧴" },
    { title: "Makeup Organizer Acrylic Rotating", cost: 11.7, emoji: "💄" },
  ],
  Fitness: [
    { title: "Resistance Bands Set 5-Pack", cost: 5.9, emoji: "💪" },
    { title: "Yoga Mat Non-Slip 6mm Thick", cost: 8.5, emoji: "🧘" },
    { title: "Ab Roller Wheel with Knee Pad", cost: 6.2, emoji: "🤸" },
    { title: "Jump Rope Weighted Speed Training", cost: 4.0, emoji: "🪢" },
  ],
  Pets: [
    { title: "Self-Cleaning Cat Litter Mat", cost: 7.8, emoji: "🐱" },
    { title: "Interactive Laser Cat Toy", cost: 9.4, emoji: "🐈" },
    { title: "Slow Feeder Dog Bowl Non-Slip", cost: 5.3, emoji: "🐶" },
    { title: "Pet Grooming Glove Deshedding", cost: 3.6, emoji: "🐾" },
  ],
  Outdoors: [
    { title: "Camping Hammock with Mosquito Net", cost: 13.9, emoji: "🏕️" },
    { title: "LED Headlamp Rechargeable 1200 Lumens", cost: 8.7, emoji: "🔦" },
    { title: "Portable Camping Stove Windproof", cost: 11.2, emoji: "🔥" },
    { title: "Insulated Cooler Backpack 25L", cost: 17.5, emoji: "🎒" },
  ],
};

const SUPPLIER_DEFS = [
  { name: "Shenzhen Tech Direct", url: "shenzhentech.cn", category: "Electronics" },
  { name: "Guangzhou Home Goods", url: "gzhomegoods.cn", category: "Home" },
  { name: "Yiwu Beauty Source", url: "yiwubeauty.cn", category: "Beauty" },
  { name: "Ningbo Fitness Co", url: "ningbofitness.cn", category: "Fitness" },
  { name: "Pet Supply Global", url: "petsupplyglobal.com", category: "Pets" },
  { name: "Outdoor Depot Intl", url: "outdoordepotintl.com", category: "Outdoors" },
  { name: "AliExpress Premium", url: "aliexpress.com", category: "General" },
  { name: "CJ Dropshipping", url: "cjdropshipping.com", category: "General" },
];

const FIRST = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Ahmed", "Fatima", "Ali", "Aisha", "Omar", "Zara", "Hassan", "Noor"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Khan", "Ahmed", "Ali", "Raza", "Sheikh", "Malik"];
const CITIES = ["Karachi", "Lahore", "New York", "London", "Dubai", "Toronto", "Sydney", "Berlin", "Paris", "Mumbai", "Singapore", "Los Angeles", "Manchester"];
const STREETS = ["Main St", "Oak Ave", "Park Road", "Hillcrest Dr", "Sunset Blvd", "Cedar Lane", "Maple Court", "Victoria Road"];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(between(0, 23), between(0, 59), 0, 0);
  return d.toISOString();
}
function genImage(emoji: string, seed: number): string {
  const hues = [220, 260, 180, 340, 30, 150];
  const h = hues[seed % hues.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},70%,92%)'/><stop offset='1' stop-color='hsl(${(h + 40) % 360},65%,82%)'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='50%' y='52%' font-size='170' text-anchor='middle' dominant-baseline='middle'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeUser(): User {
  return {
    id: "usr_demo",
    name: "Alex Morgan",
    email: "demo@bsds.app",
    passwordHash: "$2a$10$aUrCQiaaGs5WXfqFVzCrYOzgzx6Uu1vP/A.OwVvwvTj8VkCZmfbGG",
    company: "Morgan Commerce Co.",
    avatarColor: "#3563ff",
    plan: "Business",
    createdAt: daysAgo(180),
  };
}

export function buildSeed(): DBShape {
  const user = makeUser();
  const storeDefs = [
    { name: "Everyday Finds Store", platform: "Shopify" as Platform, url: "everydayfinds.myshopify.com", rev: 48230 },
    { name: "TechGadgetHub", platform: "eBay" as Platform, url: "ebay.com/str/techgadgethub", rev: 31400 },
    { name: "Home & Living Co", platform: "Wix" as Platform, url: "homeandlivingco.com", rev: 19870 },
    { name: "FitLife Essentials", platform: "Shopify" as Platform, url: "fitlife-essentials.myshopify.com", rev: 12650 },
    { name: "BeautyBargains", platform: "Facebook Marketplace" as Platform, url: "facebook.com/beautybargains", rev: 6420 },
  ];
  const stores: Store[] = storeDefs.map((d, i) => ({
    id: `sto_${i + 1}`, userId: user.id, name: d.name, platform: d.platform, url: d.url,
    status: i === 4 ? "error" : "connected", productsCount: 0, ordersCount: 0,
    revenue: d.rev, currency: "USD", connectedAt: daysAgo(between(60, 200)),
  }));

  const suppliers: Supplier[] = SUPPLIER_DEFS.map((s, i) => ({
    id: `sup_${i + 1}`, userId: user.id, name: s.name, url: s.url, category: s.category,
    rating: round2(3.8 + rand() * 1.2), shippingDays: [between(5, 9), between(10, 18)] as [number, number],
    productsCount: 0, autoOrdering: i < 5, connectedAt: daysAgo(between(30, 190)),
  }));

  const products: Product[] = [];
  let counter = 0;
  const supByCat: Record<string, Supplier> = {};
  suppliers.forEach((s) => (supByCat[s.category] = s));
  for (const [category, items] of Object.entries(CATALOG)) {
    const sup = supByCat[category] ?? suppliers[suppliers.length - 1];
    for (const item of items) {
      counter++;
      const store = pick(stores);
      const cost = item.cost;
      const sell = round2(cost * (1 + between(28, 65) / 100));
      const qty = between(0, 240);
      const sold = between(0, 320);
      const status = qty === 0 ? "out_of_stock" : rand() > 0.82 ? "inactive" : "active";
      const created = daysAgo(between(5, 160));
      products.push({
        id: `prd_${String(counter).padStart(4, "0")}`, userId: user.id, storeId: store.id, supplierId: sup.id,
        title: item.title, sku: `BSDS-${category.slice(0, 3).toUpperCase()}-${1000 + counter}`,
        image: genImage(item.emoji, counter), category, compareAtPrice: round2(sell * (1.15 + rand() * 0.4)),
        sellPrice: sell, costPrice: cost, quantity: qty, sold, status,
        sourceUrl: `https://${sup.url}/item/${10000 + counter}`,
        tags: [pick(["trending", "bestseller", "new", "seasonal"]), pick(["free-shipping", "fast-delivery", "premium"])],
        variants: between(1, 6), rating: round2(3.6 + rand() * 1.4), reviews: between(12, 1800),
        priceMonitor: rand() > 0.25, stockMonitor: rand() > 0.15, autoReprice: rand() > 0.5,
        createdAt: created, updatedAt: daysAgo(between(0, 40)),
      });
    }
  }

  const FULFILLMENT: Record<OrderStatus, Order["fulfillment"]> = {
    pending: "awaiting_order", processing: "ordered", shipped: "shipped",
    delivered: "delivered", cancelled: "failed", returned: "failed",
  };
  const orders: Order[] = [];
  for (let i = 0; i < 64; i++) {
    const store = pick(stores);
    const sp = products.filter((p) => p.storeId === store.id);
    const pool = sp.length ? sp : products;
    const items = Array.from({ length: between(1, 3) }, () => pick(pool));
    let subtotal = 0, cost = 0;
    const lineItems = items.map((p) => {
      const qty = between(1, 3);
      subtotal += p.sellPrice * qty;
      cost += p.costPrice * qty;
      return { productId: p.id, title: p.title, image: p.image, sku: p.sku, quantity: qty, sellPrice: p.sellPrice, costPrice: p.costPrice };
    });
    const shipping = round2(between(0, 8) === 0 ? 0 : 4.99 + rand() * 6);
    const age = between(0, 90);
    let status: OrderStatus;
    if (age < 3) status = pick(["pending", "pending", "processing", "shipped"]);
    else if (age < 10) status = pick(["processing", "shipped", "delivered"]);
    else if (age < 45) status = pick(["delivered", "delivered", "shipped", "returned"]);
    else status = pick(["delivered", "cancelled", "returned"]);
    const fn = pick(FIRST), ln = pick(LAST);
    orders.push({
      id: `ord_${String(10000 + i)}`, userId: user.id, storeId: store.id, orderNumber: `#BSDS-${100000 + i}`,
      customerName: `${fn} ${ln}`, customerEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@${pick(["gmail.com", "outlook.com", "yahoo.com"])}`,
      shippingAddress: `${between(1, 999)} ${pick(STREETS)}, ${pick(CITIES)}`, items: lineItems,
      subtotal: round2(subtotal), shipping, total: round2(subtotal + shipping), profit: round2(subtotal - cost - shipping * 0.4),
      status, fulfillment: FULFILLMENT[status],
      trackingNumber: status === "shipped" || status === "delivered" ? `1Z${between(100000, 999999)}${between(10, 99)}` : undefined,
      sourceOrderId: status !== "pending" ? `ALI${between(100000000, 999999999)}` : undefined,
      currency: "USD", createdAt: daysAgo(age), updatedAt: daysAgo(between(0, age)),
    });
  }
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  for (const s of stores) {
    s.productsCount = products.filter((p) => p.storeId === s.id).length;
    s.ordersCount = orders.filter((o) => o.storeId === s.id).length;
  }
  for (const s of suppliers) {
    s.productsCount = products.filter((p) => p.supplierId === s.id).length;
  }

  const rules: AutomationRule[] = [
    { id: "rul_1", userId: user.id, name: "Auto-reprice on supplier cost change", description: "Adjust sell price to preserve a 45% margin when supplier cost changes.", trigger: "price_change", action: "reprice", condition: "margin < 40%", active: true, applied: 312, lastRun: daysAgo(0), createdAt: daysAgo(120) },
    { id: "rul_2", userId: user.id, name: "Hide out-of-stock products", description: "Set listings to inactive when supplier stock reaches zero.", trigger: "stock_change", action: "deactivate", condition: "supplier_qty == 0", active: true, applied: 47, lastRun: daysAgo(1), createdAt: daysAgo(110) },
    { id: "rul_3", userId: user.id, name: "Auto-order new sales", description: "Automatically place orders with the supplier for fulfillment.", trigger: "new_order", action: "order_stock", condition: "status == pending", active: true, applied: 1284, lastRun: daysAgo(0), createdAt: daysAgo(95) },
    { id: "rul_4", userId: user.id, name: "Reactivate restocked items", description: "Reactivate listings when supplier stock returns.", trigger: "stock_change", action: "activate", condition: "supplier_qty > 10", active: false, applied: 23, lastRun: daysAgo(14), createdAt: daysAgo(80) },
    { id: "rul_5", userId: user.id, name: "Low stock alert", description: "Email notification when tracked products drop below 15 units.", trigger: "low_stock", action: "notify", condition: "supplier_qty < 15", active: true, applied: 89, lastRun: daysAgo(2), createdAt: daysAgo(60) },
    { id: "rul_6", userId: user.id, name: "Markdown slow movers", description: "Reduce price 8% on products with no sales in 21 days.", trigger: "review_received", action: "adjust_margin", condition: "sales_21d == 0", active: false, applied: 14, lastRun: daysAgo(9), createdAt: daysAgo(45) },
  ];

  const activities: Activity[] = Array.from({ length: 28 }, (_, i) => {
    const t = ["order", "price", "stock", "automation", "product", "store"][i % 6] as Activity["type"];
    const o = orders[i % orders.length];
    const msgs: Record<string, string> = {
      order: `New order ${o.orderNumber} received — $${o.profit.toFixed(2)} profit`,
      price: `Price changed on ${o.orderNumber}`,
      stock: `Stock updated for a product in ${o.orderNumber}`,
      automation: `Rule 'Auto-order' fulfilled ${o.orderNumber}`,
      product: `Product imported for ${o.orderNumber}`,
      store: `Store sync completed for ${o.orderNumber}`,
    };
    return { id: `act_${i}`, userId: user.id, type: t, message: msgs[t], createdAt: daysAgo(between(0, 14)) };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { users: [user], stores, suppliers, products, orders, rules, activities, sessions: {} };
}
