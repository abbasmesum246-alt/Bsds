"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Plus, MoreVertical, Eye, Truck, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useQuery, api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrderDetailDrawer } from "@/components/orders/order-detail-drawer";
import { NewOrderModal } from "@/components/orders/new-order-modal";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { formatCurrency, formatDateTime, cn } from "@/lib/utils";
import type { Order, OrderStatus, Store } from "@/lib/types";

export default function OrdersPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState(searchParams.get("status") || "");
  const [selected, setSelected] = React.useState<Order | null>(null);
  const [creating, setCreating] = React.useState(false);

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (statusFilter) qs.set("status", statusFilter);
  const { data, loading, reload, setData } = useQuery<{ items: Order[]; total: number }>(`/api/orders?${qs.toString()}`);
  const { data: storesData } = useQuery<{ items: Store[] }>("/api/stores");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  React.useEffect(() => { const t = setTimeout(() => setDebouncedQ(q), 250); return () => clearTimeout(t); }, [q]);

  const items = data?.items ?? [];
  const storeName = (id: string) => storesData?.items.find((s) => s.id === id)?.name || "Store";

  async function changeStatus(order: Order, s: OrderStatus) {
    const prev = data;
    setData(prev ? { ...prev, items: prev.items.map((o) => (o.id === order.id ? { ...o, status: s } : o)) } : prev);
    setSelected((cur) => (cur && cur.id === order.id ? { ...cur, status: s } : cur));
    try { await api.patch(`/api/orders/${order.id}`, { status: s }); toast.success(`Order ${s.replace(/_/g, " ")}`); }
    catch (err) { setData(prev); toast.error("Update failed", (err as Error).message); }
  }

  async function fulfill(order: Order) {
    const prev = data;
    try {
      const updated = await api.post<Order>(`/api/orders/${order.id}/fulfill`);
      setData({ items: (data?.items || []).map((o) => (o.id === order.id ? updated : o)), total: data?.total || 0 });
      setSelected(updated);
      toast.success("Order fulfilled", `Tracking: ${updated.trackingNumber}`);
    } catch (err) { setData(prev); toast.error("Fulfillment failed", (err as Error).message); }
  }

  const tabs = [["", "All"], ["pending", "Pending"], ["processing", "Processing"], ["shipped", "Shipped"], ["delivered", "Delivered"], ["cancelled", "Cancelled"], ["returned", "Returned"]] as const;

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Orders" description={`${data?.total ?? "…"} orders across all stores`} icon={<ShoppingCart className="h-5 w-5" />}
        action={<Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /><span className="hidden sm:inline">New order</span></Button>} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map(([v, l]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={cn("px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition", statusFilter === v ? "bg-violet-600 text-white" : "bg-white border border-ink-200 text-ink-600 hover:bg-ink-50")}>
            {l}
          </button>
        ))}
      </div>

      <Card className="p-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, customer, tracking…" className="input pl-9" />
          </div>
          <Button variant="secondary" size="icon" onClick={reload} aria-label="Refresh"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></Button>
        </div>
      </Card>

      {loading && !data ? (
        <Card><div className="divide-y divide-ink-100">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex items-center gap-4 px-4 py-3.5"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-20" /></div>)}</div></Card>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<ShoppingCart className="h-7 w-7" />} title="No orders found" description={q || statusFilter ? "Try adjusting your filters." : "Orders appear here automatically when customers buy."} /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-50/70 border-b border-ink-100"><tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Order</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3 hidden md:table-cell">Customer</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3 hidden lg:table-cell">Store</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Items</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Total</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Date</th>
                <th className="w-8"></th>
              </tr></thead>
              <tbody className="divide-y divide-ink-100">
                {items.map((o) => (
                  <tr key={o.id} className="hover:bg-ink-50/50 cursor-pointer transition-colors" onClick={() => setSelected(o)}>
                    <td className="px-4 py-3 text-sm align-middle">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink-900">{o.orderNumber}</span>
                        {o.fulfillment === "awaiting_order" && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                      </div>
                      <div className="text-xs text-ink-400 mt-0.5 hidden sm:block">{o.trackingNumber ? `TRK ${o.trackingNumber}` : "No tracking yet"}</div>
                    </td>
                    <td className="px-4 py-3 text-sm align-middle hidden md:table-cell"><p className="text-ink-900 font-medium">{o.customerName}</p><p className="text-xs text-ink-400">{o.customerEmail}</p></td>
                    <td className="px-4 py-3 text-sm align-middle hidden lg:table-cell text-ink-600">{storeName(o.storeId)}</td>
                    <td className="px-4 py-3 text-sm align-middle">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">{o.items.slice(0, 3).map((it, i) => <div key={i} className="h-8 w-8 rounded-md bg-ink-100 bg-cover bg-center ring-2 ring-white" style={{ backgroundImage: `url("${it.image}")` }} />)}</div>
                        <span className="text-sm text-ink-600">{o.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm align-middle text-right"><p className="font-semibold text-ink-900">{formatCurrency(o.total, o.currency)}</p><p className={cn("text-xs font-medium", o.profit >= 0 ? "text-emerald-600" : "text-red-600")}>{o.profit >= 0 ? "+" : ""}{formatCurrency(o.profit)} profit</p></td>
                    <td className="px-4 py-3 text-sm align-middle"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-sm align-middle text-right text-ink-500 text-xs whitespace-nowrap">{formatDateTime(o.createdAt)}</td>
                    <td className="px-4 py-3 align-middle" onClick={(e) => e.stopPropagation()}>
                      <Dropdown>
                        <DropdownTrigger asChild><button className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"><MoreVertical className="h-4 w-4" /></button></DropdownTrigger>
                        <DropdownContent>
                          <DropdownItem icon={<Eye className="h-4 w-4" />} onClick={() => setSelected(o)}>View details</DropdownItem>
                          {o.status === "pending" && <DropdownItem icon={<Truck className="h-4 w-4" />} onClick={() => fulfill(o)}>Fulfill now</DropdownItem>}
                          <DropdownSeparator />
                          {o.status !== "delivered" && o.status !== "cancelled" && <DropdownItem icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => changeStatus(o, "delivered")}>Mark delivered</DropdownItem>}
                          {o.status !== "cancelled" && <DropdownItem danger icon={<XCircle className="h-4 w-4" />} onClick={() => changeStatus(o, "cancelled")}>Cancel order</DropdownItem>}
                        </DropdownContent>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} onStatusChange={(s) => selected && changeStatus(selected, s)} onFulfill={() => selected && fulfill(selected)} storeName={selected ? storeName(selected.storeId) : ""} />
      <NewOrderModal open={creating} onClose={() => setCreating(false)} stores={storesData?.items || []} onCreated={(o) => { setData((prev) => prev ? { items: [o, ...prev.items], total: prev.total + 1 } : prev); toast.success("Order created", o.orderNumber); }} />
    </div>
  );
}
