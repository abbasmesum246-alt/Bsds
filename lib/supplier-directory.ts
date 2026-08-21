// Curated directory of real dropshipping suppliers (publicly known services).
// This is reference data — "connect" links go to each supplier's real site
// where the user signs up. No API key required to browse.

export type DirectorySupplier = {
  id: string;
  name: string;
  url: string;
  category: string;
  regions: string[];
  shippingDays: string;
  products: string;
  pricing: string;
  moq: string; // minimum order quantity
  rating: number; // community/aggregated 0-5
  founded: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  integration: "native" | "api" | "manual";
  logo: string; // emoji placeholder
};

export const SUPPLIER_DIRECTORY: DirectorySupplier[] = [
  {
    id: "aliexpress",
    name: "AliExpress (Dropshipping Center)",
    url: "https://www.aliexpress.com",
    category: "General marketplace",
    regions: ["Worldwide", "CN"],
    shippingDays: "7–30",
    products: "100M+",
    pricing: "Free to use, pay per order",
    moq: "1 unit",
    rating: 4.3,
    founded: 2010,
    pros: ["Massive product selection", "No minimum order", "Very low prices", "Buyer protection"],
    cons: ["Slow shipping from China", "Variable quality", "Many copycat listings"],
    bestFor: "Beginners testing products with low budget",
    integration: "api",
    logo: "🛒",
  },
  {
    id: "cj-dropshipping",
    name: "CJ Dropshipping",
    url: "https://cjdropshipping.com",
    category: "Full-service dropshipping",
    regions: ["Worldwide", "CN", "US", "EU warehouses"],
    shippingDays: "7–15",
    products: "400K+",
    pricing: "Free plan; paid from $16/mo",
    moq: "1 unit",
    rating: 4.5,
    founded: 2014,
    pros: ["Warehouses in US/EU for faster shipping", "POD & white-label", "Product sourcing", "Auto-ordering"],
    cons: ["UI can be confusing", "Some items pricier than AliExpress"],
    bestFor: "Scaling sellers needing faster shipping",
    integration: "native",
    logo: "📦",
  },
  {
    id: "spocket",
    name: "Spocket",
    url: "https://www.spocket.co",
    category: "US/EU suppliers",
    regions: ["US", "EU", "CA", "AU"],
    shippingDays: "3–7",
    products: "1M+",
    pricing: "From $39.99/mo",
    moq: "1 unit",
    rating: 4.6,
    founded: 2017,
    pros: ["Fast US/EU shipping", "Vetted suppliers", "Branded invoicing", "Up to 30-60% discount"],
    cons: ["Subscription required", "Higher product cost", "Smaller catalog than AliExpress"],
    bestFor: "Branded stores targeting US/EU buyers",
    integration: "native",
    logo: "🚀",
  },
  {
    id: "zendrop",
    name: "Zendrop",
    url: "https://www.zendrop.com",
    category: "US-focused fulfillment",
    regions: ["US", "Worldwide"],
    shippingDays: "3–7 (US)",
    products: "1M+",
    pricing: "Free plan; Pro $33/mo",
    moq: "1 unit",
    rating: 4.7,
    founded: 2019,
    pros: ["Fast US shipping", "Custom branding", "Bundles & subscriptions", "24/7 support"],
    cons: ["Free plan is limited", "Some products are AliExpress-sourced"],
    bestFor: "Shopify sellers wanting US shipping speed",
    integration: "native",
    logo: "⚡",
  },
  {
    id: "modalyst",
    name: "Modalyst",
    url: "https://www.modalyst.co",
    category: "Premium & designer brands",
    regions: ["US", "EU"],
    shippingDays: "3–8",
    products: "10M+",
    pricing: "Free up to 25 products; $35/mo",
    moq: "1 unit",
    rating: 4.4,
    founded: 2012,
    pros: ["Name-brand & eco products", "Fast domestic shipping", "Wix partnership"],
    cons: ["Higher prices", "Free plan very limited"],
    bestFor: "Fashion and premium niche stores",
    integration: "native",
    logo: "👗",
  },
  {
    id: "salehoo",
    name: "SaleHoo",
    url: "https://www.salehoo.com",
    category: "Supplier directory",
    regions: ["US", "UK", "CN", "AU"],
    shippingDays: "Varies",
    products: "2.5M+",
    pricing: "$27 one-time directory; $97/mo automation",
    moq: "Varies",
    rating: 4.3,
    founded: 2005,
    pros: ["Vetted suppliers", "Market research tool", "Money-back guarantee", "Great support"],
    cons: ["Directory only (older model)", "Upfront cost"],
    bestFor: "Finding legitimate wholesale suppliers",
    integration: "manual",
    logo: "🔍",
  },
  {
    id: "worldwide-brands",
    name: "Worldwide Brands",
    url: "https://www.worldwidebrands.com",
    category: "Wholesale directory",
    regions: ["US", "Worldwide"],
    shippingDays: "Varies",
    products: "16M+",
    pricing: "$299 one-time",
    moq: "Varies",
    rating: 4.2,
    founded: 1999,
    pros: ["Lifetime access", "Every supplier verified", "No per-sale fees"],
    cons: ["Expensive upfront", "Mostly wholesale, not pure dropship"],
    bestFor: "Serious sellers wanting a vetted directory for life",
    integration: "manual",
    logo: "🌍",
  },
  {
    id: "doba",
    name: "Doba",
    url: "https://www.doba.com",
    category: "Aggregated marketplace",
    regions: ["US", "CN"],
    shippingDays: "5–14",
    products: "1M+",
    pricing: "From $49.99/mo",
    moq: "1 unit",
    rating: 4.0,
    founded: 2002,
    pros: ["One catalog from many suppliers", "Easy to use", "Inventory alerts"],
    cons: ["Pricy", "Mixed reviews on support"],
    bestFor: "Sellers who want one place to manage many suppliers",
    integration: "native",
    logo: "🛍️",
  },
  {
    id: "sunrise-wholesale",
    name: "Sunrise Wholesale",
    url: "https://www.sunrisewholesale.com",
    category: "Wholesale dropship",
    regions: ["US"],
    shippingDays: "5–10",
    products: "30K+",
    pricing: "$49/mo or $199/yr",
    moq: "1 unit",
    rating: 4.1,
    founded: 1999,
    pros: ["BBB A+ rating", "Amazon/eBay integration", "No per-order fees"],
    cons: ["Smaller catalog", "US only"],
    bestFor: "US sellers wanting a stable, long-running supplier",
    integration: "api",
    logo: "🌅",
  },
  {
    id: "wholesale2b",
    name: "Wholesale2B",
    url: "https://www.wholesale2b.com",
    category: "All-in-one dropship",
    regions: ["US", "CA", "CN"],
    shippingDays: "3–10",
    products: "1M+",
    pricing: "From $37.75/mo",
    moq: "1 unit",
    rating: 4.1,
    founded: 2004,
    pros: ["Push products to many platforms", "Automated order handling", "No per-order fee"],
    cons: ["Clunky interface", "Support can be slow"],
    bestFor: "Multi-platform sellers wanting hands-off automation",
    integration: "native",
    logo: "🔧",
  },
  {
    id: "megagoods",
    name: "MegaGoods",
    url: "https://www.megagoods.com",
    category: "Electronics specialist",
    regions: ["US"],
    shippingDays: "3–7",
    products: "30K+",
    pricing: "$14.99/mo",
    moq: "1 unit",
    rating: 3.9,
    founded: 2004,
    pros: ["Low monthly fee", "Fast US shipping", "Electronics focus"],
    cons: ["Very narrow catalog", "Old website"],
    bestFor: "Consumer electronics niche stores",
    integration: "manual",
    logo: "📱",
  },
  {
    id: "inventory-source",
    name: "Inventory Source",
    url: "https://www.inventorysource.com",
    category: "Dropship automation",
    regions: ["US", "Worldwide"],
    shippingDays: "Varies",
    products: "Millions",
    pricing: "Free directory; automation $99/mo",
    moq: "Varies",
    rating: 4.2,
    founded: 2003,
    pros: ["Sync inventory & orders automatically", "230+ suppliers", "Flexible"],
    cons: ["Automation is expensive", "Setup takes time"],
    bestFor: "Sellers needing full inventory automation",
    integration: "native",
    logo: "⚙️",
  },
];

export function scoreSupplier(s: DirectorySupplier): number {
  // Composite score: rating, fast shipping, free/low cost, integration, product count
  let score = s.rating * 20; // up to 100
  if (s.shippingDays.includes("3–7") || s.shippingDays.includes("3–8")) score += 12;
  if (s.shippingDays.startsWith("7")) score += 6;
  if (s.pricing.toLowerCase().startsWith("free")) score += 10;
  if (s.integration === "native") score += 8;
  if (s.integration === "api") score += 4;
  if (s.products.includes("M")) score += 6;
  if (s.cons.length <= 2) score += 4;
  return Math.min(100, Math.round(score));
}
