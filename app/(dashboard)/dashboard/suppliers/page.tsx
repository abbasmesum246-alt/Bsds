"use client";
import * as React from "react";
import { Truck, Plus, Pencil, Trash2, Star, ExternalLink, RefreshCw, Zap, Globe } from "lucide-react";
import { useQuery, api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import type { Supplier } from "@/lib/types";

export default function SuppliersPage() {
  const toast = useToast();
  const { data, loading, reload, setData } = useQuery<{ items: Supplier[] }>("/api/suppliers");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Supplier | null>(null);
  const [deleting, setDeleting] = React.useState<Supplier | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", url: "", category: "General", rating: 4.5, minShipping: 7, maxShipping: 14, autoOrdering: true });

  React.useEffect(() => {
    if (editing) setForm({ name: editing.name, url: editing.url, category: editing.category, rating: editing.rating, minShipping: editing.shippingDays[0], maxShipping: editing.shippingDays[1], autoOrdering: editing.autoOrdering });
    else setForm({ name: "", url: "", category: "General", rating: 4.5, minShipping: 7, maxShipping: 14, autoOrdering: true });
  }, [editing, modalOpen]);

  async function save() {
    setSaving(true);
    try {
      const payload = { name: form.name, url: form.url, category: form.category, rating: Number(form.rating), shippingDays: [Number(form.minShipping), Number(form.maxShipping)], autoOrdering: form.autoOrdering };
      if (editing) {
        const updated = await api.patch<Supplier>(`/api/suppliers/${editing.id}`, payload);
        setData({ items: (data?.items || []).map((s) => (s.id === editing.id ? updated : s)) });
        toast.success("Supplier updated");
      } else {
        const created = await api.post<Supplier>("/api/suppliers", payload);
        setData({ items: [created, ...(data?.items || [])] });
        toast.success("Supplier connected", created.name);
      }
      setModalOpen(false); setEditing(null);
    } catch (err) { toast.error("Save failed", (err as Error).message); } finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const prev = data;
    setData({ items: (data?.items || []).filter((s) => s.id !== deleting.id) });
    try { await api.del(`/api/suppliers/${deleting.id}`); toast.success("Supplier removed"); setDeleting(null); }
    catch (err) { setData(prev); toast.error("Delete failed", (err as Error).message); }
  }

  async function toggleAuto(s: Supplier) {
    const prev = data;
    setData({ items: (data?.items || []).map((x) => (x.id === s.id ? { ...x, autoOrdering: !x.autoOrdering } : x)) });
    try { await api.patch(`/api/suppliers/${s.id}`, { autoOrdering: !s.autoOrdering }); }
    catch (err) { setData(prev); toast.error("Update failed", (err as Error).message); }
  }

  const items = data?.items ?? [];
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Suppliers" description="Manage dropshipping suppliers and auto-ordering." icon={<Truck className="h-5 w-5" />}
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /><span className="hidden sm:inline">Add supplier</span></Button>} />
      <div className="flex justify-end"><Button variant="secondary" size="sm" onClick={reload} disabled={loading}><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />Refresh</Button></div>

      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<Truck className="h-7 w-7" />} title="No suppliers yet" description="Add your first supplier to start importing products."
          action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Add supplier</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((s) => (
            <Card key={s.id} className="p-5 hover:shadow-soft transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><Truck className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink-900 truncate">{s.name}</h3>
                    <a href={`https://${s.url}`} target="_blank" rel="noreferrer" className="text-xs text-ink-500 hover:text-brand-600 inline-flex items-center gap-1 truncate"><Globe className="h-3 w-3" />{s.url}<ExternalLink className="h-3 w-3" /></a>
                  </div>
                </div>
                <Badge tone="gray">{s.category}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-ink-50 p-2.5 text-center">
                  <div className="flex items-center justify-center gap-0.5 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /><span className="text-sm font-bold text-ink-900">{s.rating.toFixed(1)}</span></div>
                  <p className="text-[11px] text-ink-500 mt-0.5">Rating</p>
                </div>
                <div className="rounded-lg bg-ink-50 p-2.5 text-center"><p className="text-sm font-bold text-ink-900">{s.shippingDays[0]}–{s.shippingDays[1]}d</p><p className="text-[11px] text-ink-500 mt-0.5">Shipping</p></div>
                <div className="rounded-lg bg-ink-50 p-2.5 text-center"><p className="text-sm font-bold text-ink-900">{formatNumber(s.productsCount)}</p><p className="text-[11px] text-ink-500 mt-0.5">Products</p></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2"><Zap className={cn("h-4 w-4", s.autoOrdering ? "text-emerald-500" : "text-ink-300")} /><span className="text-sm text-ink-600">Auto-ordering</span><Switch checked={s.autoOrdering} onChange={() => toggleAuto(s)} /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(s); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleting(s)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-xs text-ink-400 mt-3">Connected {formatDate(s.connectedAt)}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit supplier" : "Add supplier"}
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button><Button onClick={save} loading={saving}>{editing ? "Save" : "Connect"}</Button></>}>
        <div className="space-y-4">
          <div><Label>Supplier name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AliExpress Premium" /></div>
          <div><Label>Website URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="aliexpress.com" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Rating (0–5)</Label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Shipping days (min–max)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" min="0" value={form.minShipping} onChange={(e) => setForm({ ...form, minShipping: Number(e.target.value) })} />
              <Input type="number" min="0" value={form.maxShipping} onChange={(e) => setForm({ ...form, maxShipping: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3">
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-500" /><div><p className="text-sm font-medium">Auto-ordering</p><p className="text-xs text-ink-500">Automatically place orders with this supplier.</p></div></div>
            <Switch checked={form.autoOrdering} onChange={(v) => setForm({ ...form, autoOrdering: v })} />
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Remove supplier?" danger confirmLabel="Remove"
        message={<>This removes <strong>{deleting?.name}</strong>. Products remain but can't be auto-fulfilled.</>} />
    </div>
  );
}
