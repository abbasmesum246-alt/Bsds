export type ID = string;

export type Platform =
  | "Shopify" | "eBay" | "Wix" | "Facebook Marketplace"
  | "Amazon" | "WooCommerce" | "Etsy";

export type ProductStatus = "active" | "inactive" | "out_of_stock" | "monitoring";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
export type FulfillmentStatus = "awaiting_order" | "ordered" | "shipped" | "delivered" | "failed";

export interface User {
  id: ID; name: string; email: string; passwordHash: string;
  company?: string; avatarColor: string; plan: "Starter" | "Business" | "Enterprise";
  createdAt: string;
}
export interface SafeUser {
  id: ID; name: string; email: string; company?: string;
  avatarColor: string; plan: string; createdAt: string;
}
export interface Store {
  id: ID; userId: ID; name: string; platform: Platform; url: string;
  status: "connected" | "disconnected" | "error";
  productsCount: number; ordersCount: number; revenue: number;
  currency: string; connectedAt: string;
}
export interface Supplier {
  id: ID; userId: ID; name: string; url: string; category: string;
  rating: number; shippingDays: [number, number]; productsCount: number;
  autoOrdering: boolean; connectedAt: string;
}
export interface Product {
  id: ID; userId: ID; storeId: ID; supplierId: ID; title: string; sku: string;
  image: string; category: string; compareAtPrice: number; sellPrice: number;
  costPrice: number; quantity: number; sold: number; status: ProductStatus;
  sourceUrl: string; tags: string[]; variants: number; rating: number;
  reviews: number; priceMonitor: boolean; stockMonitor: boolean;
  autoReprice: boolean; createdAt: string; updatedAt: string;
}
export interface OrderItem {
  productId: ID; title: string; image: string; sku: string;
  quantity: number; sellPrice: number; costPrice: number;
}
export interface Order {
  id: ID; userId: ID; storeId: ID; orderNumber: string; customerName: string;
  customerEmail: string; shippingAddress: string; items: OrderItem[];
  subtotal: number; shipping: number; total: number; profit: number;
  status: OrderStatus; fulfillment: FulfillmentStatus;
  trackingNumber?: string; sourceOrderId?: string; currency: string;
  createdAt: string; updatedAt: string;
}
export type AutomationTrigger = "price_change" | "stock_change" | "new_order" | "low_stock" | "review_received";
export type AutomationAction = "reprice" | "deactivate" | "activate" | "order_stock" | "notify" | "adjust_margin";
export interface AutomationRule {
  id: ID; userId: ID; name: string; description: string;
  trigger: AutomationTrigger; action: AutomationAction; condition: string;
  active: boolean; applied: number; lastRun?: string; createdAt: string;
}
export interface Activity {
  id: ID; userId: ID;
  type: "order" | "product" | "store" | "supplier" | "automation" | "price" | "stock" | "auth";
  message: string; createdAt: string;
}
export interface DashboardStats {
  revenue: number; revenueDelta: number;
  orders: number; ordersDelta: number;
  profit: number; profitDelta: number;
  products: number; productsDelta: number;
  revenueSeries: { date: string; revenue: number; orders: number }[];
  statusBreakdown: { name: string; value: number; color: string }[];
  topProducts: { id: ID; title: string; image: string; sold: number; revenue: number }[];
  storePerformance: { name: string; revenue: number; orders: number }[];
  counts: {
    totalProducts: number; totalOrders: number; totalStores: number;
    totalSuppliers: number; pendingOrders: number; lowStock: number; outOfStock: number;
  };
}
export interface DBShape {
  users: User[]; stores: Store[]; suppliers: Supplier[];
  products: Product[]; orders: Order[]; rules: AutomationRule[];
  activities: Activity[];
  sessions: Record<string, { userId: ID; createdAt: string }>;
}
