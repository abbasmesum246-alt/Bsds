"use client";
import * as React from "react";
import { Store as StoreIcon, Plus, Pencil, Trash2, RefreshCw, ExternalLink, ShoppingBag, CheckCircle2, Unlink, AlertCircle } from "lucide-react";
import { useQuery, api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { formatCurrency, formatNumber, formatDate, cn } from "@/lib/utils";
import type { Store, Platform } from "@/lib/types";

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "Shopify", label: "Shopify", color: "#96bf48" },
  { value: "eBay", label: "eBay", color: "#e53238" },
  { value: "Wix", label: "Wix", color: "#000" },
  { value: "Facebook Marketplace", label: "Facebook", color: "#1877f2" },
  { value: "Amazon", label: "Amazon", color: "#ff9900" },
  { value: "WooCommerce", label: "WooCommerce", color: "#7f54b3" },
  { value: "Etsy", label: "Etsy", color: "#f56400" },
];

export default function StoresPage() {
  const toast = useToast();
  const { data, loading, reload, setData } = useQuery<{ items: Store[] }>("/api/stores");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Store | null>(null);
  const [deleting, setDeleting] = React.useState<Store | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", platform: "Shopify" as Platform, url: "", currency: "USD" });

  React.useEffect(() => {
    if (editing) setForm({ name: editing.name, platform: editing.platform, url: editing.url, currency: editing.currency });
    else setForm({ name: "", platform: "Shopify", url: "", currency: "USD" });
  }, [editing, modalOpen]);

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.patch<Store>(`/api/stores/${editing.id}`, form);
        setData({ items: (data?.items || []).map((s) => (s.id === editing.id ? updated : s)) });
        toast.success("Store updated");
      } else {
        const created = await api.post<Store>("/api/stores", form);
        setData({ items: [created, ...(data?.items || [])] });
        toast.success("Store connected", created.name);
      }
      setModalOpen(false); setEditing(null);
    } catch (err) { toast.error("Save failed", (err as Error).message); } finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const prev = data;
    setData({ items: (data?.items || []).filter((s) => s.id !== deleting.id) });
    try { await api.del(`/api/stores/${deleting.id}`); toast.success("Store removed"); setDeleting(null); }
    catch (err) { setData(prev); toast.error("Delete failed", (err as Error).message); }
  }

  async function toggleStatus(s: Store) {
    const newStatus = s.status === "connected" ? "disconnected" : "connected";
    const prev = data;
    setData({ items: (data?.items || []).map((x) => (x.id === s.id ? { ...x, status: newStatus } : x)) });
    try { await api.patch(`/api/stores/${s.id}`, { status: newStatus }); toast.success(newStatus === "connected" ? "Reconnected" : "Disconnected"); }
    catch (err) { setData(prev); toast.error("Action failed", (err as Error).message); }
  }

  const items = data?.items ?? [];
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Stores" description="Connect and manage all your sales channels." icon={<StoreIcon className="h-5 w-5" />}
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /><span className="hidden sm:inline">Connect store</span></Button>} />
      <div className="flex justify-end"><Button variant="secondary" size="sm" onClick={reload} disabled={loading}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />Sync all</Button></div>

      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<StoreIcon className="h-7 w-7" />} title="No stores connected" description="Connect Shopify, eBay, Wix and more to start syncing."
          action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Connect your first store</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => {
            const p = PLATFORMS.find((x) => x.value === s.platform);
            return (
              <Card key={s.id} className="overflow-hidden hover:shadow-soft transition">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: p?.color || "#64748b" }}><ShoppingBag className="h-5 w-5" /></div>
                      <div className="min-w-0"><h3 className="font-semibold text-ink-900 truncate">{s.name}</h3><p className="text-xs text-ink-500">{s.platform}</p></div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  {s.url && <a href={`https://${s.url}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-ink-500 hover:text-brand-600 truncate max-w-full">{s.url}<ExternalLink className="h-3 w-3 shrink-0" /></a>}
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-ink-50 py-2.5 px-1"><p className="text-sm font-bold text-ink-900">{formatNumber(s.productsCount)}</p><p className="text-[11px] text-ink-500 mt-0.5">Products</p></div>
                    <div className="rounded-lg bg-ink-50 py-2.5 px-1"><p className="text-sm font-bold text-ink-900">{formatNumber(s.ordersCount)}</p><p className="text-[11px] text-ink-500 mt-0.5">Orders</p></div>
                    <div className="rounded-lg bg-ink-50 py-2.5 px-1"><p className="text-sm font-bold text-ink-900">{formatCurrency(s.revenue, s.currency)}</p><p className="text-[11px] text-ink-500 mt-0.5">Revenue</p></div>
                  </div>
                  <p className="text-xs text-ink-400 mt-4">Connected {formatDate(s.connectedAt)}</p>
                </div>
                <div className="border-t border-ink-100 px-4 py-2.5 flex items-center gap-1 bg-ink-50/50">
                  <button onClick={() => { setEditing(s); setModalOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-ink-600 hover:bg-white py-1.5 rounded-md"><Pencil className="h-3.5 w-3.5" />Edit</button>
                  <button onClick={() => toggleStatus(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-ink-600 hover:bg-white py-1.5 rounded-md">
                    {s.status === "connected" ? <><Unlink className="h-3.5 w-3.5" />Disconnect</> : <><CheckCircle2 className="h-3.5 w-3.5" />Reconnect</>}
                  </button>
                  <button onClick={() => setDeleting(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 hover:bg-red-50 py-1.5 rounded-md"><Trash2 className="h-3.5 w-3.5" />Remove</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit store" : "Connect a store"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button><Button onClick={save} loading={saving}>{editing ? "Save" : "Connect"}</Button></>}>
        <div className="space-y-4">
          <div><Label>Store name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Awesome Store" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Platform</Label><Select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Platform })}>{PLATFORMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</Select></div>
            <div><Label>Currency</Label><Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>{["USD", "EUR", "GBP", "PKR", "AUD", "CAD"].map((c) => <option key={c} value={c}>{c}</option>)}</Select></div>
          </div>
          <div><Label>Store URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="mystore.myshopify.com" /></div>
          {!editing && <div className="rounded-lg bg-sky-50 border border-sky-100 p-3 flex gap-2.5 text-xs text-sky-800"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><p>In production you'd authorize with {form.platform}. This demo creates a connected store instantly.</p></div>}
        </div>
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Remove store?" danger confirmLabel="Remove"
        message={<>This disconnects <strong>{deleting?.name}</strong>. Existing orders are kept.</>} />
    </div>
  );
}
