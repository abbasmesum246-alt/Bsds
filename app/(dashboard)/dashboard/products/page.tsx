"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Package, Plus, Upload, LayoutGrid, List, MoreVertical, Pencil, Trash2, RefreshCw, Star, AlertTriangle, Filter } from "lucide-react";
import { useQuery, api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmDialog } from "@/components/ui/modal";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { ImportModal } from "@/components/products/import-modal";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import type { Product, Store, Supplier } from "@/lib/types";

export default function ProductsPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState(searchParams.get("q") || "");
  const [status, setStatus] = React.useState(searchParams.get("status") || "");
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [page, setPage] = React.useState(1);
  const perPage = 12;

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [importOpen, setImportOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Product | null>(null);
  const [deletingNow, setDeletingNow] = React.useState(false);

  const { data: storesData } = useQuery<{ items: Store[] }>("/api/stores");
  const { data: suppliersData } = useQuery<{ items: Supplier[] }>("/api/suppliers");

  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (status) qs.set("status", status);
  qs.set("sort", "updated");

  const { data, loading, reload, setData } = useQuery<{ items: Product[]; total: number }>(`/api/products?${qs.toString()}`);

  const [debouncedQ, setDebouncedQ] = React.useState(q);
  React.useEffect(() => { const t = setTimeout(() => setDebouncedQ(q), 250); return () => clearTimeout(t); }, [q]);
  React.useEffect(() => setPage(1), [debouncedQ, status]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paged = items.slice((page - 1) * perPage, page * perPage);

  const storeName = (id: string) => storesData?.items.find((s) => s.id === id)?.name || "—";
  const supplierName = (id: string) => suppliersData?.items.find((s) => s.id === id)?.name || "—";

  async function updateProduct(id: string, patch: Partial<Product>) {
    const prev = data;
    setData(prev ? { ...prev, items: prev.items.map((p) => (p.id === id ? { ...p, ...patch } : p)) } : prev);
    try {
      await api.patch(`/api/products/${id}`, patch);
      toast.success("Updated");
    } catch (err) {
      setData(prev);
      toast.error("Update failed", (err as Error).message);
    }
  }

  function handleSaved(p: Product) {
    setData((prev) => {
      if (!prev) return prev;
      const exists = prev.items.some((x) => x.id === p.id);
      return { ...prev, items: exists ? prev.items.map((x) => (x.id === p.id ? p : x)) : [p, ...prev.items], total: exists ? prev.total : prev.total + 1 };
    });
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingNow(true);
    const prev = data;
    setData(prev ? { items: prev.items.filter((p) => p.id !== deleting.id), total: Math.max(0, prev.total - 1) } : prev);
    try {
      await api.del(`/api/products/${deleting.id}`);
      toast.success("Product deleted", deleting.title);
      setDeleting(null);
    } catch (err) {
      setData(prev);
      toast.error("Delete failed", (err as Error).message);
    } finally { setDeletingNow(false); }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Products" description={`${formatNumber(total)} product${total === 1 ? "" : "s"} across all stores`} icon={<Package className="h-5 w-5" />}
        action={<>
          <Button variant="secondary" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" /><span className="hidden sm:inline">Import from URL</span></Button>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /><span className="hidden sm:inline">Add product</span></Button>
        </>} />

      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, SKU or tag…" className="input pl-9" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
              <Select value={status} onChange={(e) => setStatus(e.target.value)} className="pl-9 w-44">
                <option value="">All statuses</option>
                <option value="active">Active</option><option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of stock</option><option value="monitoring">Monitoring</option>
              </Select>
            </div>
            <Button variant="secondary" size="icon" onClick={reload} aria-label="Refresh"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /></Button>
            <div className="hidden sm:flex rounded-lg border border-ink-200 p-0.5">
              <button onClick={() => setView("table")} className={cn("p-1.5 rounded-md", view === "table" ? "bg-ink-100 text-ink-900" : "text-ink-400")}><List className="h-4 w-4" /></button>
              <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md", view === "grid" ? "bg-ink-100 text-ink-900" : "text-ink-400")}><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </Card>

      {loading && !data ? (
        <Card><div className="divide-y divide-ink-100">{Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton className="h-12 w-12 rounded-lg" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /><Skeleton className="h-6 w-16" /><Skeleton className="h-8 w-8" />
          </div>))}</div></Card>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<Package className="h-7 w-7" />} title="No products found"
          description={q || status ? "Try adjusting your search or filters." : "Import your first product from a supplier URL or add one manually."}
          action={<div className="flex gap-2"><Button variant="secondary" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" />Import from URL</Button><Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" />Add product</Button></div>} /></Card>
      ) : view === "table" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink-50/70 border-b border-ink-100"><tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Product</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3 hidden md:table-cell">Store</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Price</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3 hidden sm:table-cell">Stock</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3 hidden lg:table-cell">Monitor</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-500 px-4 py-3">Status</th>
                <th className="w-8"></th>
              </tr></thead>
              <tbody className="divide-y divide-ink-100">
                {paged.map((p) => {
                  const margin = p.sellPrice > 0 ? ((p.sellPrice - p.costPrice) / p.sellPrice) * 100 : 0;
                  return (
                    <tr key={p.id} className="hover:bg-ink-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm align-middle">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-lg bg-ink-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${p.image}")` }} />
                          <div className="min-w-0">
                            <p className="font-medium text-ink-900 truncate max-w-[260px]">{p.title}</p>
                            <div className="flex items-center gap-2 text-xs text-ink-500 mt-0.5">
                              <span className="font-mono">{p.sku}</span><span>·</span><span className="truncate">{supplierName(p.supplierId)}</span>
                              <span>·</span><span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm align-middle hidden md:table-cell text-ink-600">{storeName(p.storeId)}</td>
                      <td className="px-4 py-3 text-sm align-middle text-right">
                        <div className="font-semibold text-ink-900">{formatCurrency(p.sellPrice)}</div>
                        <div className={cn("text-xs", margin >= 30 ? "text-emerald-600" : margin >= 15 ? "text-amber-600" : "text-red-600")}>{margin.toFixed(0)}% margin</div>
                      </td>
                      <td className="px-4 py-3 text-sm align-middle text-right hidden sm:table-cell">
                        <span className={cn("font-medium", p.quantity === 0 ? "text-red-600" : p.quantity < 15 ? "text-amber-600" : "text-ink-700")}>{formatNumber(p.quantity)}</span>
                        {p.quantity > 0 && p.quantity < 15 && <AlertTriangle className="inline h-3 w-3 text-amber-500 ml-1" />}
                        <div className="text-xs text-ink-400">{p.sold} sold</div>
                      </td>
                      <td className="px-4 py-3 text-sm align-middle text-center hidden lg:table-cell">
                        <div className="inline-flex items-center gap-3"><Switch checked={p.priceMonitor} onChange={(v) => updateProduct(p.id, { priceMonitor: v })} /></div>
                      </td>
                      <td className="px-4 py-3 text-sm align-middle"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 align-middle">
                        <Dropdown>
                          <DropdownTrigger asChild><button className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"><MoreVertical className="h-4 w-4" /></button></DropdownTrigger>
                          <DropdownContent>
                            <DropdownItem icon={<Pencil className="h-4 w-4" />} onClick={() => { setEditing(p); setFormOpen(true); }}>Edit</DropdownItem>
                            <DropdownItem icon={<Package className="h-4 w-4" />} onClick={() => updateProduct(p.id, { status: p.status === "active" ? "inactive" : "active" })}>{p.status === "active" ? "Deactivate" : "Activate"}</DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem danger icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleting(p)}>Delete</DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-ink-100 text-sm">
              <p className="text-ink-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paged.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-soft transition">
              <div className="aspect-square bg-ink-100 bg-cover bg-center" style={{ backgroundImage: `url("${p.image}")` }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2"><p className="font-medium text-ink-900 text-sm line-clamp-2 flex-1">{p.title}</p><StatusBadge status={p.status} /></div>
                <p className="text-xs text-ink-500 mt-1 truncate">{storeName(p.storeId)}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div><p className="text-lg font-bold text-ink-900 leading-none">{formatCurrency(p.sellPrice)}</p><p className="text-xs text-ink-400 line-through mt-1">{formatCurrency(p.compareAtPrice)}</p></div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setFormOpen(true); }} className="p-1.5 rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(p)} className="p-1.5 rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={handleSaved} product={editing} stores={storesData?.items || []} suppliers={suppliersData?.items || []} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={handleSaved} stores={storesData?.items || []} suppliers={suppliersData?.items || []} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Delete product?" danger confirmLabel="Delete" loading={deletingNow}
        message={<>This will permanently remove <strong>{deleting?.title}</strong> from your catalog. This action cannot be undone.</>} />
    </div>
  );
}
