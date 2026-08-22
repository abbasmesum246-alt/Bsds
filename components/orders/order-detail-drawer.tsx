"use client";
import * as React from "react";
import { X, Truck, MapPin, Mail, Package, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

export function OrderDetailDrawer({ order, onClose, onStatusChange, onFulfill, storeName }: {
  order: Order | null; onClose: () => void;
  onStatusChange: (s: OrderStatus) => void; onFulfill: () => void; storeName: string;
}) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!order) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [order, onClose]);
  if (!order) return null;
  const subtotal = order.items.reduce((s, i) => s + i.sellPrice * i.quantity, 0);
  function copyTracking() {
    if (!order?.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-pop overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-ink-100 px-6 py-4 flex items-center justify-between z-10">
          <div><h2 className="text-lg font-bold text-ink-900">{order.orderNumber}</h2><p className="text-xs text-ink-500">{formatDateTime(order.createdAt)}</p></div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between"><StatusBadge status={order.status} /><span className="badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200">{storeName}</span></div>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Customer</h3>
            <div className="rounded-xl border border-ink-100 p-4 space-y-2">
              <p className="font-semibold text-ink-900">{order.customerName}</p>
              <p className="text-sm text-ink-600 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-ink-400" />{order.customerEmail}</p>
              <p className="text-sm text-ink-600 flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-ink-400 mt-0.5 shrink-0" />{order.shippingAddress || "No shipping address"}</p>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Items ({order.items.length})</h3>
            <div className="rounded-xl border border-ink-100 divide-y divide-ink-100">
              {order.items.map((it, i) => (
                <div key={i} className="flex gap-3 p-3">
                  <div className="h-14 w-14 rounded-lg bg-ink-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${it.image}")` }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900 line-clamp-2">{it.title}</p>
                    <p className="text-xs text-ink-400 font-mono mt-0.5">{it.sku}</p>
                    <div className="flex items-center justify-between mt-1.5"><span className="text-xs text-ink-500">{formatCurrency(it.sellPrice)} × {it.quantity}</span><span className="text-sm font-semibold">{formatCurrency(it.sellPrice * it.quantity)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="rounded-xl border border-ink-100 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-ink-600"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span></div>
              <div className="border-t border-ink-100 pt-2 flex justify-between font-semibold text-ink-900"><span>Total</span><span>{formatCurrency(order.total, order.currency)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-ink-500">Net profit</span><span className={cn("font-semibold", order.profit >= 0 ? "text-emerald-600" : "text-red-600")}>{order.profit >= 0 ? "+" : ""}{formatCurrency(order.profit)}</span></div>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">Fulfillment</h3>
            <div className="rounded-xl border border-ink-100 p-4 space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-ink-500">Status</span><StatusBadge status={order.fulfillment} /></div>
              {order.sourceOrderId && <div className="flex items-center justify-between"><span className="text-sm text-ink-500">Supplier order</span><span className="text-sm font-mono text-ink-900">{order.sourceOrderId}</span></div>}
              {order.trackingNumber ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500 flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" />Tracking</span>
                  <button onClick={copyTracking} className="text-sm font-mono text-violet-600 hover:underline inline-flex items-center gap-1">{order.trackingNumber}{copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}</button>
                </div>
              ) : <p className="text-xs text-ink-400">Tracking appears once the order ships.</p>}
            </div>
          </section>
          <div className="space-y-2 pt-2">
            {order.status === "pending" && <Button className="w-full" onClick={onFulfill}><Truck className="h-4 w-4" />Fulfill order now</Button>}
            <div className="grid grid-cols-2 gap-2">
              {order.status === "pending" && <Button variant="secondary" onClick={() => onStatusChange("processing")}><Package className="h-4 w-4" />Processing</Button>}
              {order.status !== "delivered" && order.status !== "cancelled" && <Button variant="secondary" onClick={() => onStatusChange("delivered")}><CheckCircle2 className="h-4 w-4" />Delivered</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
