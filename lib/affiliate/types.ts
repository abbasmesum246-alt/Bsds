// Affiliate marketing type definitions

export type AffiliateMode = "guest" | "account";

export type NetworkCategory =
  | "general" | "fashion" | "tech" | "beauty" | "finance"
  | "health" | "gaming" | "travel" | "education" | "saas" | "adult";

export interface AffiliateNetwork {
  id: string;
  name: string;
  url: string;
  signupUrl: string;
  category: NetworkCategory;
  commissionRate: string;
  cookieLength: string;
  payoutType: "CPA" | "CPS" | "CPL" | "RevShare" | "Hybrid";
  minPayout: string;
  payoutMethods: string[];
  rating: number;
  founded: number;
  merchants: number;
  regions: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  approvalDifficulty: "easy" | "medium" | "hard";
  trackingReliability: number; // 0-100
}

export interface AffiliateOffer {
  id: string;
  networkId: string;
  title: string;
  brand: string;
  description: string;
  category: string;
  commission: string;
  commissionValue: number; // numeric % or $ for sorting
  commissionType: "percent" | "flat";
  epc: number; // earnings per click in dollars
  conversionRate: number; // %
  cookieLength: string;
  payout: string;
  url: string;
  trending: "up" | "down" | "stable";
  trendingPct: number;
  gravity: number; // popularity score
  regions: string[];
  tags: string[];
  influencerFit: number; // 0-100 how good for influencers
  recurring: boolean;
  image: string;
}

export interface Campaign {
  id: string;
  offerId: string;
  offerTitle: string;
  brand: string;
  platform: "instagram" | "youtube" | "tiktok" | "blog" | "email" | "twitter" | "pinterest" | "facebook";
  status: "draft" | "active" | "paused" | "ended";
  link: string;
  clicks: number;
  conversions: number;
  revenue: number;
  spend: number;
  startDate: string;
  notes: string;
  contentIdea?: string;
}

export interface Strategy {
  id: string;
  title: string;
  platform: string;
  offer: string;
  angle: string;
  contentFormat: string;
  hook: string;
  cta: string;
  postingSchedule: string;
  expectedCtr: number;
  expectedConversion: number;
  tips: string[];
  steps: string[];
  niche: string;
}

export interface ClickByDay {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalSpend: number;
  conversionRate: number;
  epc: number;
  roi: number;
  activeCampaigns: number;
  offersPromoted: number;
  clicksByDay: ClickByDay[];
  topPlatforms: { platform: string; clicks: number; revenue: number }[];
  topOffers: { offerId: string; offerTitle: string; brand: string; clicks: number; conversions: number; revenue: number; epc: number }[];
}
