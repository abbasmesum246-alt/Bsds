// Complete affiliate marketing category knowledge base.
// Each category has a plain-English definition, how it works, strategies,
// roadmaps, pros/cons, realistic earnings, and best platforms.

export interface AffiliateCategory {
  id: string;
  name: string;
  emoji: string;
  definition: string;
  howItWorks: string;
  commissionRange: string;
  realisticEarnings: string;
  bestPlatforms: { name: string; why: string }[];
  strategies: { title: string; steps: string[] }[];
  roadmap: string[];
  pros: string[];
  cons: string[];
  skillsNeeded: string[];
  contentFormats: string[];
  pitfalls: string[];
}

export const AFFILIATE_CATEGORIES: AffiliateCategory[] = [
  {
    id: "content",
    name: "Content Creators & Reviewers",
    emoji: "🎬",
    definition: "YouTubers, bloggers, and streamers who build an audience by creating useful or entertaining content, then recommend products their audience actually needs.",
    howItWorks: "You create review videos, tutorials, or comparison articles. You put affiliate links in descriptions or within posts. When a viewer buys through your link, you earn a commission.",
    commissionRange: "1%–50% depending on the product. Physical products pay 1–10%; digital/SaaS pay 20–50% recurring.",
    realisticEarnings: "$0–$500/month for the first 6 months. $1k–$10k/month with 50k+ engaged followers. Top creators earn $50k+/month.",
    bestPlatforms: [
      { name: "YouTube", why: "Highest trust and long-tail traffic from search" },
      { name: "Personal Blog", why: "Full control, best for SEO and email capture" },
      { name: "Amazon Associates", why: "Easy to start, massive catalog" },
      { name: "Impact / PartnerStack", why: "Premium brands with high commissions" },
    ],
    strategies: [
      {
        title: "Best-of list videos",
        steps: [
          "Pick a specific category (e.g. 'best wireless earbuds under $100')",
          "Test or research 5 products",
          "Lead with a clear winner, then rank others",
          "Put affiliate links to every product in description",
          "Pin a comment with links",
          "Remake every 6 months to stay relevant",
        ],
      },
      {
        title: "Honest long-term reviews",
        steps: [
          "Buy and use a product for 30+ days",
          "Show real results, flaws and all",
          "Compare to alternatives",
          "Give a clear verdict: who it's for",
          "Link in description with honest note you may earn",
        ],
      },
    ],
    roadmap: [
      "Month 1: Pick one niche and create 4 videos around it",
      "Month 2-3: Apply to Amazon Associates + 1 premium network",
      "Month 4: Start building email list from video viewers",
      "Month 6: Add higher-commission SaaS products",
      "Month 12: Negotiate direct deals with brands",
    ],
    pros: ["High trust converts well", "Content earns for years (SEO)", "Authentic — recommend what you use", "Multiple income streams possible"],
    cons: ["Takes 6-12 months to see real income", "Need on-camera presence or writing skill", "Algorithm changes can hurt traffic", "Honest reviews may limit what you promote"],
    skillsNeeded: ["Video editing or writing", "Basic SEO", "On-camera confidence", "Research"],
    contentFormats: ["Long-form reviews (10-20 min)", "Comparison videos", "Tutorials", 'Best-of "top 10" lists', "Email newsletters"],
    pitfalls: ["Promoting products you don't use", "Not disclosing affiliate links (illegal)", "Chasing trends outside your niche", "Ignoring SEO titles/thumbnails"],
  },
  {
    id: "influencer",
    name: "Social Media Influencers",
    emoji: "✨",
    definition: "Instagram, TikTok and Pinterest creators with a following in a specific lifestyle niche (fashion, beauty, fitness, food, travel). You promote through stories, reels and posts.",
    howItWorks: "Brands pay you per post or give you an affiliate link/code. You create native-feeling content showcasing the product. Followers click your bio link or use your code; you earn commission.",
    commissionRange: "5%–30% per sale, plus flat fees from $50–$10,000+ per sponsored post for large accounts.",
    realisticEarnings: "$100–$2k/month for micro-influencers (10k followers). $5k–$50k/month at 100k+ with good engagement.",
    bestPlatforms: [
      { name: "Shopify Collabs", why: "Direct DTC brand deals built for creators" },
      { name: "LTK (RewardStyle)", why: "Premium fashion/beauty brands, high commissions" },
      { name: "TikTok Shop", why: "In-app checkout, viral reach" },
      { name: "Awin / ShareASale", why: "Thousands of brands in one dashboard" },
    ],
    strategies: [
      {
        title: "Authentic product integration",
        steps: [
          "Only accept products that fit your aesthetic",
          "Show the product in real life, not as an ad",
          "Use Stories for behind-the-scenes and swipe-ups",
          "Give honest feedback — flaws build trust",
          "Track which posts convert best and double down",
        ],
      },
      {
        title: "Discount-code model",
        steps: [
          "Negotiate a personal code (e.g. YOURNAME15)",
          "Put it in bio + every post caption",
          "Mention it verbally in Reels/TikToks",
          "Codes are trackable and feel exclusive",
        ],
      },
    ],
    roadmap: [
      "0-1k: Post daily in one niche, build aesthetic",
      "1k-10k: Join Shopify Collabs, LTK or Awin",
      "10k-50k: Add affiliate link in bio (Linktree/Beacons)",
      "50k+: Pitch brands directly for flat fee + commission",
      "100k+: Hire a manager, negotiate exclusives",
    ],
    pros: ["Fast to start (no website needed)", "Visual products convert well", "Direct brand deals can be very lucrative", "Creative freedom"],
    cons: ["Algorithm-dependent", "Engagement drops over time", "Follower count ≠ income", "Brand partnerships can feel inauthentic"],
    skillsNeeded: ["Photography/short video", "Aesthetic sense", "Community engagement", "Pitching to brands"],
    contentFormats: ["Reels/TikToks (15-60s)", "Stories with links", "Carousel posts", "IG Lives", "Pinterest idea pins"],
    pitfalls: ["Buying fake followers (brands check engagement)", "Over-posting ads and losing trust", "Not using trackable links", "Ignoring Stories (highest engagement)"],
  },
  {
    id: "seo",
    name: "Bloggers & SEO Publishers",
    emoji: "✍️",
    definition: "You build niche websites that rank on Google for buying-intent keywords ('best X for Y', 'X review', 'X vs Y'). Traffic converts because people are already looking to buy.",
    howItWorks: "You write detailed, helpful articles targeting keywords people search before buying. You place affiliate links naturally in the content. Google sends free, recurring traffic for years.",
    commissionRange: "3%–50%. Best results with high-ticket items (web hosting, software, finance).",
    realisticEarnings: "$0 first 6-9 months. $500–$3k/month by month 12. $5k–$50k/month for established sites. Some authority sites sell for 6 figures.",
    bestPlatforms: [
      { name: "Amazon Associates", why: "Best for physical product roundups" },
      { name: "Impact / CJ Affiliate", why: "High-commission brands" },
      { name: "ShareASale / Awin", why: "Huge merchant selection" },
      { name: "PartnerStack", why: "Recurring SaaS commissions" },
    ],
    strategies: [
      {
        title: "Buying-intent keyword targeting",
        steps: [
          "Target 'best [product] for [use case]' keywords",
          "Target '[product] review' and '[product A] vs [product B]'",
          "Avoid informational-only keywords (no buying intent)",
          "Write 2,000+ word definitive guides",
          "Update posts quarterly to keep rankings",
        ],
      },
      {
        title: "Comparison & deal pages",
        steps: [
          "Create comparison tables with your #1 pick",
          "Add a 'best for X' breakdown",
          "Show pros/cons honestly",
          "Update during Black Friday / Prime Day",
          "Capture emails with a buying guide PDF",
        ],
      },
    ],
    roadmap: [
      "Month 1: Pick a niche, buy domain, set up WordPress",
      "Month 2-3: Publish 20 high-quality articles",
      "Month 4-6: Build backlinks, apply to affiliate networks",
      "Month 6-9: First $100/month usually arrives",
      "Year 2: Scale content, add email list, hit $1k+/month",
    ],
    pros: ["Most passive income channel", "Traffic compounds for years", "No face/camera needed", "Can sell the site later for 30-40× monthly profit"],
    cons: ["Slow start (6-12 months)", "Google algorithm updates can wipe traffic", "Requires consistent writing", "Technical SEO learning curve"],
    skillsNeeded: ["SEO keyword research", "WordPress", "On-page SEO", "Writing", "Basic link building"],
    contentFormats: ["Best-of listicles", "Product reviews", "Comparison posts", "How-to guides with product recommendations", "Deal/coupon pages"],
    pitfalls: ["Thin AI-generated content", "Keyword stuffing", "Not disclosing affiliate links (FTC required)", "Ignoring site speed and Core Web Vitals"],
  },
  {
    id: "email",
    name: "Email Marketers",
    emoji: "📧",
    definition: "You build an email list around a topic and send valuable newsletters with carefully chosen product recommendations. Email has the highest conversion rate of any channel because people already trust you.",
    howItWorks: "You offer a free lead magnet (checklist, guide, template) in exchange for an email. You send a mix of value and promotional emails. Each email contains affiliate links to products you genuinely recommend.",
    commissionRange: "10%–70%, especially high with recurring SaaS and online courses.",
    realisticEarnings: "$1–$5 per subscriber per month is a common benchmark. A 5,000-person list can earn $5k–$25k/month.",
    bestPlatforms: [
      { name: "ConvertKit / Beehiiv", why: "Built for creators, easy automations" },
      { name: "PartnerStack", why: "SaaS products with recurring commissions" },
      { name: "Digistore24 / ClickBank", why: "High-commission info products" },
      { name: "Amazon Associates", why: "Broad product range for general lists" },
    ],
    strategies: [
      {
        title: "Value-first welcome sequence",
        steps: [
          "Deliver the free lead magnet immediately",
          "Send a 5-email onboarding sequence (80% value, 20% offer)",
          "Tell your story and why you're credible",
          "Recommend one flagship product by email 4-5",
          "Then move subscribers to weekly newsletter",
        ],
      },
      {
        title: "Weekly curated newsletter",
        steps: [
          "Pick a theme your list cares about",
          "Share 3 useful tips + 1 product recommendation",
          "Write honest personal experience with the product",
          "Use a clear single CTA per email",
          "Track clicks and double down on winners",
        ],
      },
    ],
    roadmap: [
      "Week 1: Pick email tool (ConvertKit free tier)",
      "Week 2: Create a lead magnet (PDF checklist)",
      "Month 1: Build a simple landing page, start sharing it",
      "Month 2: Write 5-email welcome sequence",
      "Month 3+: Send weekly newsletter, grow list from other channels",
    ],
    pros: ["Highest conversion rates (3-10% vs 1% social)", "You own the list (no algorithm)", "Recurring revenue with SaaS", "Very low cost to run"],
    cons: ["Takes time to build the list", "Need consistent sending schedule", "Deliverability is a skill", "Promoting too much burns the list"],
    skillsNeeded: ["Copywriting", "Email automation", "Audience research", "Basic design"],
    contentFormats: ["Welcome sequences", "Weekly newsletters", "Product launch emails", "Curated deals", "Autoresponder courses"],
    pitfalls: ["Buying email lists (illegal in most countries)", "Sending only promotions", "Ignoring subject lines (80% of opens)", "Not cleaning inactive subscribers"],
  },
  {
    id: "paid",
    name: "Paid Media Buyers",
    emoji: "💰",
    definition: "You run paid ads (Facebook, Google, YouTube, TikTok) to affiliate offers and keep the difference between ad cost and commission. This is the most numbers-driven branch of affiliate marketing.",
    howItWorks: "You pick an offer with a high payout, build an ad campaign, and pay per click. If you spend $100 on ads and earn $300 in commission, you keep $200 profit. You scale what works and kill what doesn't.",
    commissionRange: "$5–$300+ per conversion (CPA offers). Best with high-ticket or recurring products.",
    realisticEarnings: "Most lose money for the first 1-3 months learning. Profitable media buyers earn $3k–$50k+/month but it requires starting capital.",
    bestPlatforms: [
      { name: "MaxBounty", why: "Top CPA network with fast payouts" },
      { name: "ClickBank", why: "High-commission digital products" },
      { name: "OfferNation / CPALead", why: "Beginner-friendly CPA offers" },
      { name: "Direct SaaS affiliate programs", why: "Recurring commissions, high LTV" },
    ],
    strategies: [
      {
        title: "Test small, scale fast",
        steps: [
          "Start with $20–$50/day per ad set",
          "Test 3-5 angles at once",
          "Kill anything unprofitable after 3 days",
          "Double budget on winners every 3 days",
          "Always track conversion with a pixel/postback",
        ],
      },
      {
        title: "Hook-problem-offer formula",
        steps: [
          "First 3 seconds: pattern interrupt (hook)",
          "Agitate the problem the audience has",
          "Present the offer as the solution",
          "Clear CTA with urgency",
          "Use native-looking creatives, not polished ads",
        ],
      },
    ],
    roadmap: [
      "Month 1: Learn the basics (free courses on YouTube)",
      "Month 2: Pick one traffic source and one vertical",
      "Month 3: Set aside $500–$2000 test budget",
      "Month 4-6: Find your first winning campaign",
      "Month 6+: Scale winners, reinvest profits",
    ],
    pros: ["Fastest path to high income", "Results are measurable", "Can scale quickly", "No audience needed to start"],
    cons: ["You can lose money while learning", "Requires starting capital ($500+ recommended)", "Platforms ban accounts", "Steep learning curve"],
    skillsNeeded: ["Copywriting", "Ad platform knowledge", "Data analysis", "Tracking (Google Ads, pixels)"],
    contentFormats: ["Facebook/Instagram ads", "YouTube pre-roll", "TikTok spark ads", "Google search ads", "Native ads (Taboola/Outbrain)"],
    pitfalls: ["Running paid without conversion tracking", "Spending too much too early", "Promoting low-commission offers", "Ignoring ad account bans (always have backups)"],
  },
  {
    id: "saas",
    name: "SaaS & B2B Affiliates",
    emoji: "⚙️",
    definition: "You promote subscription software (website builders, CRMs, email tools, SEO software). These pay RECURRING commissions — you earn every month the customer stays subscribed.",
    howItWorks: "You create content comparing or reviewing software, or recommend tools you use to your audience. A single referral can pay you $20–$200/month for years.",
    commissionRange: "20%–50% RECURRING for life of the customer. Some also pay bounties $50–$1,000.",
    realisticEarnings: "$500–$5k/month within a year due to compounding recurring revenue. Top SaaS affiliates earn $50k+/month passively.",
    bestPlatforms: [
      { name: "PartnerStack", why: "Best SaaS-only affiliate marketplace" },
      { name: "Impact", why: "Premium SaaS brands (Shopify, HubSpot, Canva)" },
      { name: "Direct programs", why: "Notion, Webflow, ConvertKit all run direct" },
    ],
    strategies: [
      {
        title: "Best-for-X comparison content",
        steps: [
          "Target '[tool] alternatives' and 'best [tool] for [use case]'",
          "Create honest comparison tables",
          "Give a clear winner for each audience type",
          "Use the tool yourself and show screenshots",
          "Update content as pricing changes",
        ],
      },
      {
        title: "Tutorial + recommendation",
        steps: [
          "Teach something the software does (e.g. 'how to build a landing page')",
          "Recommend the tool you're teaching",
          "Include your affiliate link in the tutorial",
          "Offer a bonus (template, call) for using your link",
        ],
      },
    ],
    roadmap: [
      "Pick a software category you know",
      "Apply to 5 partner programs (free to join)",
      "Create 10 comparison/review pieces",
      "Build an email list around the topic",
      "Recurring compounds — by month 12 you'll have real MRR",
    ],
    pros: ["Recurring passive income", "High commission rates", "Long cookie lifetimes (60-120 days)", "Low refund rates"],
    cons: ["B2B sales cycles are longer", "Audience needs to be business-minded", "Some programs require audience proof", "Conversions take longer to close"],
    skillsNeeded: ["Software knowledge", "Comparison writing", "SEO", "Basic B2B marketing"],
    contentFormats: ["Software comparisons", "How-to tutorials", "Case studies", "YouTube walkthroughs", "Email courses"],
    pitfalls: ["Promoting software you haven't used", "Ignoring churn (customers cancel)", "Not building an email list", "Forgetting to mention recurring nature to readers"],
  },
  {
    id: "coupon",
    name: "Deal & Coupon Sites",
    emoji: "🏷️",
    definition: "You build websites or social accounts that curate coupons, deals and discounts. People searching for a coupon land on your page and click your affiliate link.",
    howItWorks: "When someone searches 'Nike coupon code', they land on your page. Even if the coupon doesn't work, your affiliate cookie is set — if they buy, you get commission.",
    commissionRange: "1%–20%, mostly from large retailers. Volume game — small per-order but massive traffic.",
    realisticEarnings: "$1k–$20k/month for successful coupon sites. Very competitive but scalable.",
    bestPlatforms: [
      { name: "Awin / ShareASale", why: "Most coupon-friendly programs" },
      { name: "Rakuten", why: "Big retail brands" },
      { name: "CJ Affiliate", why: "Major retailers" },
      { name: "Honey/PayPal affiliates", why: "Browser extension model" },
    ],
    strategies: [
      {
        title: "Brand + coupon keyword SEO",
        steps: [
          "Target '[brand] coupon code' keywords",
          "Create one page per brand",
          "Update codes daily (auto-import from networks)",
          "Show 'best offer' prominently",
          "Use click-to-reveal for extra engagement",
        ],
      },
    ],
    roadmap: [
      "Pick a niche (fashion, tech, travel)",
      "Set up a coupon theme on WordPress",
      "Join 10-20 affiliate programs",
      "Publish 100+ brand pages",
      "Build backlinks and rank on Google",
    ],
    pros: ["High purchase intent", "Cookie attribution even without code use", "Scalable", "Content doesn't need to be creative"],
    cons: ["Very competitive SEO", "Thin content penalized by Google", "Low margins", "Need to constantly update coupons"],
    skillsNeeded: ["SEO", "WordPress", "Data entry", "Basic automation"],
    contentFormats: ["Coupon pages", "Deal roundups", "Black Friday hubs", "Browser extensions"],
    pitfalls: ["Fake coupons hurt trust", "Google's 'coupon site' penalties", "Not checking if codes work", "Competing with huge sites like RetailMeNot"],
  },
  {
    id: "niche",
    name: "Niche Communities",
    emoji: "🎯",
    definition: "You run a Reddit, Discord, Facebook group or forum around a specific hobby/profession. You recommend products the community genuinely needs as one of them, not as an outsider.",
    howItWorks: "You build trust by helping people daily. When you recommend a product you actually use, people buy because you're a trusted peer. Recommendations are in-thread and in a pinned 'gear list'.",
    commissionRange: "5%–40%. High conversion because trust is enormous.",
    realisticEarnings: "$500–$5k/month for a 10k-person active community. Top niche communities earn much more through sponsorships.",
    bestPlatforms: [
      { name: "Amazon Associates", why: "Easy for hobby gear lists" },
      { name: "Impact / ShareASale", why: "Niche-specific brands" },
      { name: "Direct brand deals", why: "Brands pay to reach active communities" },
    ],
    strategies: [
      {
        title: "Trusted member first, affiliate second",
        steps: [
          "Answer questions daily for 3 months before promoting",
          "Create a pinned 'gear I recommend' list",
          "Only promote things you personally use",
          "Disclose affiliate links clearly",
          "Remove bad recommendations even if they earn",
        ],
      },
    ],
    roadmap: [
      "Pick a niche you're active in",
      "Start a free Discord/Facebook group",
      "Post helpful content daily",
      "At 1k members, add a recommended-tools page",
      "At 10k members, pitch brands directly",
    ],
    pros: ["Extremely high trust and conversion", "Low effort once community runs", "Multiple monetization options", "Defensible moat"],
    cons: ["Takes daily moderation", "Slow to build", "Can feel awkward to monetize", "Community may resent promotion"],
    skillsNeeded: ["Community management", "Niche expertise", "Conflict resolution", "Consistency"],
    contentFormats: ["Pinned recommendation lists", "AMAs", "Deal threads", "Gear guides", "Sponsored posts"],
    pitfalls: ["Promoting low-quality products", "Over-monetizing too early", "Hiding affiliate links", "Letting the community become spammy"],
  },
];

export function findCategory(id: string): AffiliateCategory | undefined {
  return AFFILIATE_CATEGORIES.find((c) => c.id === id.toLowerCase());
}
