"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Link2, CheckCircle2 } from "lucide-react";
import type { Product, Store, Supplier } from "@/lib/types";

export function ImportModal({ open, onClose, onImported, stores, suppliers }: {
  open: boolean; onClose: () => void; onImported: (p: Product) => void;
  stores: Store[]; suppliers: Supplier[];
}) {
  const toast = useToast();
  const [url, setUrl] = React.useState("");
  const [storeId, setStoreId] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setUrl("");
      setStoreId(stores[0]?.id || "");
      setSupplierId(suppliers[0]?.id || "");
    }
  }, [open, stores, suppliers]);

  async function onImport() {
    if (!url) return;
    setLoading(true);
    try {
      const product = await api.post<Product>("/api/import", { url, storeId, supplierId });
      onImported(product);
      toast.success("Product imported", product.title);
      onClose();
    } catch (err) {
      toast.error("Import failed", (err as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title="Import product from URL"
      description="Paste a supplier product link. We'll pull title, images, price and variants."
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={onImport} loading={loading} disabled={!url || !storeId}>
          <Link2 className="h-4 w-4" />Import to store
        </Button>
      </>}>
      <div className="space-y-4">
        <div>
          <Label>Product URL</Label>
          <Input autoFocus value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.aliexpress.com/item/1005006123456789.html" />
          <p className="text-xs text-ink-400 mt-1.5">Supports AliExpress, CJ Dropshipping, Amazon, and 100+ suppliers.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Target store</Label>
            <Select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
          <div><Label>Fulfillment supplier</Label>
            <Select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
        </div>
        {url && (
          <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
            <div className="text-xs text-brand-800">
              <p className="font-semibold">Ready to import</p>
              <p className="mt-0.5 text-brand-700/80">We'll apply your default pricing rules, enable price &amp; stock monitoring, and publish to <strong>{stores.find((s) => s.id === storeId)?.name}</strong>.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
