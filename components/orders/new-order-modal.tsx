"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { X, Search } from "lucide-react";
import type { Order, Product, Store } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function NewOrderModal({ open, onClose, stores, onCreated }: {
  open: boolean; onClose: () => void; stores: Store[]; onCreated: (o: Order) => void;
}) {
  const toast = useToast();
  const [storeId, setStoreId] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selected, setSelected] = React.useState<{ productId: string; quantity: number }[]>([]);
  const [search, setSearch] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) { setStoreId(stores[0]?.id || ""); setCustomerName(""); setCustomerEmail(""); setShippingAddress(""); setSelected([]); setSearch(""); }
  }, [open, stores]);

  React.useEffect(() => {
    if (!storeId) return;
    api.get<{ items: Product[] }>(`/api/products?storeId=${storeId}`).then((r) => setProducts(r.items)).catch(() => setProducts([]));
  }, [storeId]);

  const addProduct = (id: string) => setSelected((s) => s.some((x) => x.productId === id) ? s : [...s, { productId: id, quantity: 1 }]);
  const removeProduct = (id: string) => setSelected((s) => s.filter((x) => x.productId !== id));
  const setQty = (id: string, q: number) => setSelected((s) => s.map((x) => x.productId === id ? { ...x, quantity: q } : x));
  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
  const total = selected.reduce((s, x) => { const p = products.find((y) => y.id === x.productId); return s + (p ? p.sellPrice * x.quantity : 0); }, 0);

  async function submit() {
    if (!customerName || !customerEmail || selected.length === 0) {
      toast.error("Missing details", "Customer and at least one product required."); return;
    }
    setSaving(true);
    try {
      const order = await api.post<Order>("/api/orders", { storeId, customerName, customerEmail, shippingAddress, items: selected });
      onCreated(order); onClose();
    } catch (err) { toast.error("Could not create order", (err as Error).message); } finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create order manually" description="Record an offline or custom order." size="lg"
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={submit} loading={saving} disabled={selected.length === 0}>Create order · {formatCurrency(total + 4.99)}</Button>
      </>}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Store</Label><Select value={storeId} onChange={(e) => setStoreId(e.target.value)}>{stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
          <div><Label>Customer email</Label><Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="customer@example.com" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Customer name</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Doe" /></div>
          <div><Label>Shipping address</Label><Input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="123 Main St, City" /></div>
        </div>
        <div>
          <Label>Products</Label>
          <div className="relative mb-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" /><Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
          {search && (
            <div className="rounded-lg border border-ink-200 mb-3 max-h-48 overflow-y-auto">
              {filtered.length === 0 ? <p className="p-3 text-sm text-ink-400 text-center">No products</p> : filtered.map((p) => (
                <button key={p.id} onClick={() => addProduct(p.id)} className="w-full flex items-center gap-3 p-2 hover:bg-ink-50 text-left">
                  <div className="h-9 w-9 rounded bg-ink-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${p.image}")` }} />
                  <div className="min-w-0 flex-1"><p className="text-sm truncate">{p.title}</p><p className="text-xs text-ink-400 font-mono">{p.sku}</p></div>
                  <span className="text-sm font-semibold">{formatCurrency(p.sellPrice)}</span>
                </button>
              ))}
            </div>
          )}
          {selected.length > 0 && (
            <div className="rounded-lg border border-ink-200 divide-y divide-ink-100">
              {selected.map((s) => {
                const p = products.find((x) => x.id === s.productId); if (!p) return null;
                return (
                  <div key={s.productId} className="flex items-center gap-3 p-2.5">
                    <div className="h-10 w-10 rounded bg-ink-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${p.image}")` }} />
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs text-ink-400">{formatCurrency(p.sellPrice)} each</p></div>
                    <input type="number" min={1} value={s.quantity} onChange={(e) => setQty(s.productId, Number(e.target.value))} className="w-16 rounded border border-ink-200 px-2 py-1 text-sm" />
                    <button onClick={() => removeProduct(s.productId)} className="p-1 text-ink-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                  </div>
                );
              })}
            </div>
          )}
          {selected.length === 0 && !search && <p className="text-xs text-ink-400 text-center py-3">Search above to add products.</p>}
        </div>
      </div>
    </Modal>
  );
}
