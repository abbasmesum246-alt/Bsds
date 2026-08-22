"use client";
import * as React from "react";
import { Workflow, Plus, Pencil, Trash2, Zap, TrendingUp, PackageX, PackageCheck, ShoppingCart, Bell, Percent, Play, Pause } from "lucide-react";
import { useQuery, api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { cn, timeAgo } from "@/lib/utils";
import type { AutomationRule, AutomationTrigger, AutomationAction } from "@/lib/types";

const TRIGGERS: { value: AutomationTrigger; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "price_change", label: "Price changes", icon: <TrendingUp className="h-4 w-4" />, desc: "Supplier cost changes" },
  { value: "stock_change", label: "Stock changes", icon: <PackageCheck className="h-4 w-4" />, desc: "Inventory updates" },
  { value: "new_order", label: "New order", icon: <ShoppingCart className="h-4 w-4" />, desc: "Customer orders" },
  { value: "low_stock", label: "Low stock", icon: <PackageX className="h-4 w-4" />, desc: "Below threshold" },
  { value: "review_received", label: "Review received", icon: <Bell className="h-4 w-4" />, desc: "New customer review" },
];
const ACTIONS: { value: AutomationAction; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "reprice", label: "Reprice product", icon: <Percent className="h-4 w-4" />, desc: "Adjust to target margin" },
  { value: "deactivate", label: "Hide listing", icon: <Pause className="h-4 w-4" />, desc: "Set product inactive" },
  { value: "activate", label: "Publish listing", icon: <Play className="h-4 w-4" />, desc: "Set product active" },
  { value: "order_stock", label: "Auto-order", icon: <ShoppingCart className="h-4 w-4" />, desc: "Place supplier order" },
  { value: "notify", label: "Send notification", icon: <Bell className="h-4 w-4" />, desc: "Email alert" },
  { value: "adjust_margin", label: "Adjust margin", icon: <TrendingUp className="h-4 w-4" />, desc: "Raise/lower markup" },
];

export default function AutomationsPage() {
  const toast = useToast();
  const { data, loading, setData } = useQuery<{ items: AutomationRule[] }>("/api/automations");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AutomationRule | null>(null);
  const [deleting, setDeleting] = React.useState<AutomationRule | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", description: "", trigger: "price_change" as AutomationTrigger, action: "reprice" as AutomationAction, condition: "", active: true });

  React.useEffect(() => {
    if (editing) setForm({ name: editing.name, description: editing.description, trigger: editing.trigger, action: editing.action, condition: editing.condition, active: editing.active });
    else setForm({ name: "", description: "", trigger: "price_change", action: "reprice", condition: "", active: true });
  }, [editing, modalOpen]);

  async function save() {
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.patch<AutomationRule>(`/api/automations/${editing.id}`, form);
        setData({ items: (data?.items || []).map((r) => (r.id === editing.id ? updated : r)) });
        toast.success("Rule updated");
      } else {
        const created = await api.post<AutomationRule>("/api/automations", form);
        setData({ items: [created, ...(data?.items || [])] });
        toast.success("Automation created", created.name);
      }
      setModalOpen(false); setEditing(null);
    } catch (err) { toast.error("Save failed", (err as Error).message); } finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const prev = data;
    setData({ items: (data?.items || []).filter((r) => r.id !== deleting.id) });
    try { await api.del(`/api/automations/${deleting.id}`); toast.success("Rule deleted"); setDeleting(null); }
    catch (err) { setData(prev); toast.error("Delete failed", (err as Error).message); }
  }

  async function toggleActive(rule: AutomationRule) {
    const prev = data;
    setData({ items: (data?.items || []).map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r)) });
    try { await api.patch(`/api/automations/${rule.id}`, { active: !rule.active }); toast.success(rule.active ? "Paused" : "Activated"); }
    catch (err) { setData(prev); toast.error("Update failed", (err as Error).message); }
  }

  const items = data?.items ?? [];
  const activeCount = items.filter((r) => r.active).length;
  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Automations" description={`${activeCount} of ${items.length} rules active — set it and forget it.`} icon={<Workflow className="h-5 w-5" />}
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" /><span className="hidden sm:inline">New rule</span></Button>} />

      {loading && !data ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      ) : items.length === 0 ? (
        <Card><EmptyState icon={<Workflow className="h-7 w-7" />} title="No automation rules" description="Create your first rule to reprice, fulfill, or manage stock automatically."
          action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Create rule</Button>} /></Card>
      ) : (
        <div className="space-y-3">
          {items.map((rule) => {
            const trigger = TRIGGERS.find((t) => t.value === rule.trigger);
            const action = ACTIONS.find((a) => a.value === rule.action);
            return (
              <Card key={rule.id} className="p-5 hover:shadow-soft transition">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", rule.active ? "bg-brand-50 text-violet-600" : "bg-ink-100 text-ink-400")}><Zap className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-ink-900">{rule.name}</h3>
                        <Badge tone={rule.active ? "green" : "gray"}>{rule.active ? "Active" : "Paused"}</Badge>
                      </div>
                      {rule.description && <p className="text-sm text-ink-500 mt-1 line-clamp-2">{rule.description}</p>}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-50 px-2 py-1 text-xs text-ink-600">{trigger?.icon}<span className="font-medium">When:</span> {trigger?.label}</span>
                        <span className="text-ink-300">→</span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 text-xs text-brand-700">{action?.icon}<span className="font-medium">Then:</span> {action?.label}</span>
                        {rule.condition && rule.condition !== "always" && <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">if {rule.condition}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:border-l sm:border-ink-100 sm:pl-4">
                    <div className="text-right sm:min-w-[90px]">
                      <p className="text-lg font-bold text-ink-900 leading-none">{rule.applied.toLocaleString()}</p>
                      <p className="text-[11px] text-ink-400 mt-1">times run</p>
                      {rule.lastRun && <p className="text-[10px] text-ink-400 mt-0.5">{timeAgo(rule.lastRun)}</p>}
                    </div>
                    <Switch checked={rule.active} onChange={() => toggleActive(rule)} />
                    <button onClick={() => { setEditing(rule); setModalOpen(true); }} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(rule)} className="p-1.5 rounded-lg text-ink-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit automation" : "New automation rule"} description="Automatically take action when something changes." size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button><Button onClick={save} loading={saving}>{editing ? "Save" : "Create rule"}</Button></>}>
        <div className="space-y-4">
          <div><Label>Rule name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Auto-reprice on cost change" /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Plain-English description" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Trigger</Label>
              <Select value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value as AutomationTrigger })}>{TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select>
              <p className="text-xs text-ink-400 mt-1">{TRIGGERS.find((t) => t.value === form.trigger)?.desc}</p>
            </div>
            <div>
              <Label>Action</Label>
              <Select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value as AutomationAction })}>{ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</Select>
              <p className="text-xs text-ink-400 mt-1">{ACTIONS.find((a) => a.value === form.action)?.desc}</p>
            </div>
          </div>
          <div><Label>Condition (optional)</Label><Input value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="e.g. margin < 40%, supplier_qty < 15" /></div>
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3">
            <div><p className="text-sm font-medium">Enable rule</p><p className="text-xs text-ink-500">Start running immediately.</p></div>
            <Switch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} title="Delete rule?" danger confirmLabel="Delete"
        message={<>This permanently deletes <strong>{deleting?.name}</strong>.</>} />
    </div>
  );
}
