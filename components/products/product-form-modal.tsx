"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import type { Product, Store, Supplier, ProductStatus } from "@/lib/types";

export function ProductFormModal({ open, onClose, onSaved, stores, suppliers, product }: {
  open: boolean; onClose: () => void; onSaved: (p: Product) => void;
  stores: Store[]; suppliers: Supplier[]; product?: Product | null;
}) {
  const toast = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<Partial<Product>>({});

  React.useEffect(() => {
    if (open) {
      setForm(product || {
        storeId: stores[0]?.id, supplierId: suppliers[0]?.id, status: "active",
        quantity: 0, costPrice: 0, sellPrice: 0, compareAtPrice: 0,
        category: "General", tags: [], variants: 1,
      });
    }
  }, [open, product, stores, suppliers]);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        costPrice: Number(form.costPrice), sellPrice: Number(form.sellPrice),
        compareAtPrice: Number(form.compareAtPrice), quantity: Number(form.quantity), variants: Number(form.variants),
        tags: typeof form.tags === "string" ? String(form.tags).split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
      };
      const saved = product
        ? await api.patch<Product>(`/api/products/${product.id}`, payload)
        : await api.post<Product>("/api/products", payload);
      toast.success(product ? "Product updated" : "Product created", saved.title);
      onSaved(saved);
      onClose();
    } catch (err) {
      toast.error("Could not save", (err as Error).message);
    } finally { setSaving(false); }
  }

  const margin = form.sellPrice && form.costPrice
    ? (((Number(form.sellPrice) - Number(form.costPrice)) / Number(form.sellPrice)) * 100).toFixed(1) : "0";

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit product" : "Add new product"}
      description={product ? "Update listing details, pricing or stock." : "Create a new product listing."}
      size="lg"
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" form="prod-form" loading={saving}>{product ? "Save changes" : "Create product"}</Button>
      </>}>
      <form id="prod-form" onSubmit={onSubmit} className="space-y-4">
        <div><Label>Title</Label><Input required value={form.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="Wireless Earbuds Pro" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Store</Label>
            <Select value={form.storeId} onChange={(e) => set("storeId", e.target.value)}>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.platform})</option>)}
            </Select>
          </div>
          <div><Label>Supplier</Label>
            <Select value={form.supplierId} onChange={(e) => set("supplierId", e.target.value)}>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><Label>Cost ($)</Label><Input type="number" step="0.01" min="0" value={form.costPrice ?? ""} onChange={(e) => set("costPrice", Number(e.target.value))} /></div>
          <div><Label>Sell ($)</Label><Input type="number" step="0.01" min="0" value={form.sellPrice ?? ""} onChange={(e) => set("sellPrice", Number(e.target.value))} /></div>
          <div><Label>Compare-at ($)</Label><Input type="number" step="0.01" min="0" value={form.compareAtPrice ?? ""} onChange={(e) => set("compareAtPrice", Number(e.target.value))} /></div>
          <div><Label>Stock</Label><Input type="number" min="0" value={form.quantity ?? ""} onChange={(e) => set("quantity", Number(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><Label>SKU</Label><Input value={form.sku || ""} onChange={(e) => set("sku", e.target.value)} /></div>
          <div><Label>Category</Label><Input value={form.category || ""} onChange={(e) => set("category", e.target.value)} /></div>
          <div><Label>Variants</Label><Input type="number" min="1" value={form.variants ?? 1} onChange={(e) => set("variants", Number(e.target.value))} /></div>
          <div><Label>Status</Label>
            <Select value={form.status as ProductStatus} onChange={(e) => set("status", e.target.value as ProductStatus)}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of stock</option><option value="monitoring">Monitoring</option>
            </Select>
          </div>
        </div>
        <div><Label>Tags (comma separated)</Label>
          <Input value={Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags as unknown as string) || ""}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) as unknown as string[] }))}
            placeholder="trending, bestseller" />
        </div>
        <div><Label>Source URL</Label><Input value={form.sourceUrl || ""} onChange={(e) => set("sourceUrl", e.target.value)} placeholder="https://supplier.com/item/123" /></div>
        <div className="rounded-lg bg-ink-50 px-4 py-3 text-sm flex items-center justify-between">
          <span className="text-ink-600">Gross margin</span>
          <span className={Number(margin) >= 30 ? "font-semibold text-emerald-600" : Number(margin) >= 15 ? "font-semibold text-amber-600" : "font-semibold text-red-600"}>{margin}%</span>
        </div>
      </form>
    </Modal>
  );
}
