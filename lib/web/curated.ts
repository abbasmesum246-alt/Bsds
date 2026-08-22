// Curated, always-available web results used when no live search API key
// is configured. Lets the Best Suppliers / Affiliate search pages return
// real, useful links out of the box. Users can add a RapidAPI key for
// truly live results any time.

export interface WebResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

type Entry = { keywords: string[]; results: WebResult[] };

const ENTRIES: Entry[] = [
  {
    keywords: ["dropship", "supplier", "aliexpress", "sourcing", "fulfillment"],
    results: [
      { title: "AliExpress — Source millions of products", url: "https://www.aliexpress.com", snippet: "Massive catalog with low unit cost and ePacket/Cainiao shipping. Most dropshippers start here.", source: "aliexpress.com" },
      { title: "CJ Dropshipping — Sourcing & warehouses worldwide", url: "https://cjdropshipping.com", snippet: "Product sourcing, US/EU warehouses, POD and auto-fulfillment. Popular alternative to AliExpress.", source: "cjdropshipping.com" },
      { title: "Spocket — US & EU fast-shipping suppliers", url: "https://www.spocket.co", snippet: "Vetted suppliers with 3–5 day US/EU shipping and higher margins.", source: "spocket.co" },
      { title: "SaleHoo — Supplier directory", url: "https://www.salehoo.com", snippet: "8,000+ vetted wholesale suppliers and a market research lab.", source: "salehoo.com" },
      { title: "Zendrop — Global dropshipping", url: "https://www.zendrop.com", snippet: "Fast US shipping, custom branding, and automated fulfillment.", source: "zendrop.com" },
      { title: "DSers — AliExpress order automation", url: "https://www.dsers.com", snippet: "Bulk place hundreds of AliExpress orders in one click.", source: "dsers.com" },
    ],
  },
  {
    keywords: ["affiliate", "program", "commission", "offers", "recurring"],
    results: [
      { title: "Amazon Associates", url: "https://affiliate-program.amazon.com", snippet: "Up to 10% commission. Huge catalog but only a 24-hour cookie — conversions must be fast.", source: "amazon.com" },
      { title: "ShareASale", url: "https://www.shareasale.com", snippet: "Thousands of merchants across niches; reliable payments.", source: "shareasale.com" },
      { title: "Impact", url: "https://impact.com", snippet: "Partnership platform with many SaaS and brand programs.", source: "impact.com" },
      { title: "CJ Affiliate", url: "https://www.cj.com", snippet: "Large network with major brands; deep reporting.", source: "cj.com" },
      { title: "Awin", url: "https://www.awin.com", snippet: "Strong in retail, finance and telco, especially in Europe.", source: "awin.com" },
      { title: "PartnerStack — B2B SaaS recurring", url: "https://partnerstack.com", snippet: "High-commission, recurring SaaS affiliate programs.", source: "partnerstack.com" },
    ],
  },
  {
    keywords: ["shopify", "store", "ecommerce", "build"],
    results: [
      { title: "Shopify — Start & grow an online store", url: "https://www.shopify.com", snippet: "Leading hosted platform with thousands of apps and themes.", source: "shopify.com" },
      { title: "WooCommerce", url: "https://woocommerce.com", snippet: "Free, fully customizable WordPress store plugin.", source: "woocommerce.com" },
      { title: "BigCommerce", url: "https://www.bigcommerce.com", snippet: "Scalable hosted platform with strong SEO.", source: "bigcommerce.com" },
    ],
  },
  {
    keywords: ["trending", "winning", "product", "research", "sell"],
    results: [
      { title: "Google Trends", url: "https://trends.google.com", snippet: "Free tool to check search interest over time and by region.", source: "trends.google.com" },
      { title: "TikTok Creative Center", url: "https://ads.tiktok.com/business/creativecenter", snippet: "See trending products, hashtags and ads on TikTok.", source: "tiktok.com" },
      { title: "Meta Ads Library", url: "https://www.facebook.com/ads/library", snippet: "See what ads competitors are running right now.", source: "facebook.com" },
    ],
  },
  {
    keywords: ["payment", "gateway", "paypal", "stripe", "checkout"],
    results: [
      { title: "Stripe", url: "https://stripe.com", snippet: "Developer-friendly payments with global support.", source: "stripe.com" },
      { title: "PayPal", url: "https://www.paypal.com/business", snippet: "Widely trusted checkout; higher consumer confidence.", source: "paypal.com" },
    ],
  },
];

const GENERIC: WebResult[] = [
  { title: "Google Trends — Validate demand", url: "https://trends.google.com", snippet: "Check whether interest in your topic or product is rising, flat, or falling.", source: "trends.google.com" },
  { title: "Reddit — Real audience research", url: "https://www.reddit.com", snippet: "Search subreddits to learn what real customers complain about and want.", source: "reddit.com" },
  { title: "YouTube Academy", url: "https://www.youtube.com/creators/", snippet: "Free guides on growing an audience — key for both dropshipping and affiliate.", source: "youtube.com" },
];

export function curatedSearch(query: string): WebResult[] {
  const q = query.toLowerCase();
  const scored = ENTRIES.map((e) => ({
    score: e.keywords.reduce((s, k) => (q.includes(k) ? s + 1 : s), 0),
    results: e.results,
  }));
  scored.sort((a, b) => b.score - a.score);
  const out: WebResult[] = [];
  for (const s of scored) {
    if (s.score > 0) for (const r of s.results) if (!out.find((x) => x.url === r.url)) out.push(r);
  }
  for (const r of GENERIC) if (!out.find((x) => x.url === r.url)) out.push(r);
  return out.slice(0, 12);
}
