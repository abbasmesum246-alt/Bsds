"use client";
import * as React from "react";
import {
  Puzzle, Key, CheckCircle2, XCircle, Loader2, ExternalLink,
  Bot, Search, ShoppingCart, Sparkles, RefreshCw, AlertCircle, Eye, EyeOff, ShieldCheck, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ServiceStatus { ok: boolean; message: string; updatedAt?: string }

export default function IntegrationsPage() {
  const toast = useToast();
  const [has, setHas] = React.useState<Record<string, boolean>>({});
  const [status, setStatus] = React.useState<Record<string, ServiceStatus>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState<string | null>(null);
  const [show, setShow] = React.useState<Record<string, boolean>>({});
  const [form, setForm] = React.useState<Record<string, string>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get<{ has: Record<string, boolean>; status: Record<string, ServiceStatus> }>("/api/integrations");
      setHas(r.has); setStatus(r.status);
    } finally { setLoading(false); }
  }, []);
  React.useEffect(() => { load(); }, [load]);

  async function save(service: string, payload: Record<string, string>) {
    setSaving(service);
    try {
      const r = await fetch("/api/integrations", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Save failed");
      const results: Record<string, { ok: boolean; message: string }> = data.results || {};
      setHas((h) => ({ ...h, ...Object.fromEntries(Object.keys(payload).map((k) => [k, true])) }));
      setStatus((s) => ({ ...s, ...results, ...data.status }));
      Object.keys(payload).forEach((k) => setForm((f) => ({ ...f, [k]: "" })));
      const allOk = Object.values(results).every((r) => r.ok);
      if (allOk) toast.success("Connected & verified", Object.values(results).map((r) => r.message).join(", "));
      else toast.error("Saved but connection failed", "Check your key and try Test.");
    } catch (e) { toast.error("Save failed", (e as Error).message); }
    finally { setSaving(null); }
  }

  async function test(service: string) {
    setTesting(service);
    try {
      const r = await fetch("/api/integrations", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ service }),
      });
      const data = await r.json();
      setStatus((s) => ({ ...s, [service]: data.result, ...data.status }));
      if (data.result?.ok) toast.success("Connection works", data.result.message);
      else toast.error("Connection failed", data.result?.message);
    } finally { setTesting(null); }
  }

  const svc = (key: string) => status[key];

  return (
    <div className="space-y-5 animate-in">
      <PageHeader title="Integrations" description="Connect real services. Keys are encrypted and every connection is actually tested — not just saved." icon={<Puzzle className="h-5 w-5" />} />

      {/* Built-in, works out of the box */}
      <div className="card-premium p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#4f46e5,#0d9488)" }}>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-xl" />
        <div className="relative flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/20 ring-1 ring-white/25 flex items-center justify-center shrink-0"><Zap className="h-5 w-5" /></div>
          <div>
            <p className="font-extrabold text-base flex items-center gap-2">Ready to use — no keys needed
              <Badge className="bg-white/20 text-white ring-1 ring-white/25"><CheckCircle2 className="h-3 w-3" /> Built-in</Badge>
            </p>
            <p className="text-sm text-white/85 mt-1 leading-relaxed">Your AI assistant, web/best-supplier search, curated offers and supplier directory all work immediately. The optional keys below only add extra power (a smarter cloud AI or fully live search results).</p>
          </div>
        </div>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/60">
        <CardContent className="p-4 flex gap-3 text-sm text-emerald-900">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold">Your keys are safe</p>
            <p className="text-emerald-800/80 text-xs mt-0.5">Keys are encrypted with AES-256 before storage. When you save, BSD actually pings the service to verify — if it says "Connected", it really is. Keys are always optional.</p>
          </div>
        </CardContent>
      </Card>

      {/* AI */}
      <IntegrationCard
        service="groq"
        icon={<Bot className="h-5 w-5" />}
        title="AI Assistant — built-in ✓ (upgrade with Groq)"
        subtitle="Works right now. Add a free Groq key for a smarter, web-aware cloud model."
        color="from-blue-500 to-indigo-600"
        hasKey={has.GROQ_API_KEY}
        status={svc("groq")}
        fields={[
          { key: "GROQ_API_KEY", label: "Groq API Key", placeholder: "gsk_...", href: "https://console.groq.com/keys", hrefLabel: "Get free key" },
        ]}
        form={form} setForm={setForm} show={show} setShow={setShow}
        saving={saving === "groq"} testing={testing === "groq"}
        onSave={(payload) => save("groq", payload)}
        onTest={() => test("groq")}
        builtIn="Active"
        instructions={[
          "Go to console.groq.com/keys (free, no credit card)",
          "Sign in and click 'Create API Key'",
          "Copy the key (starts with gsk_) and paste it below",
          "Click Save — BSDS will verify it works",
        ]}
      />

      <IntegrationCard
        service="openai"
        icon={<Bot className="h-5 w-5" />}
        title="OpenAI (alternative AI)"
        subtitle="Used if Groq isn't configured. GPT-4o-mini."
        color="from-emerald-500 to-teal-600"
        hasKey={has.OPENAI_API_KEY}
        status={svc("openai")}
        fields={[
          { key: "OPENAI_API_KEY", label: "OpenAI Secret Key", placeholder: "sk-...", href: "https://platform.openai.com/api-keys", hrefLabel: "Get key" },
        ]}
        form={form} setForm={setForm} show={show} setShow={setShow}
        saving={saving === "openai"} testing={testing === "openai"}
        onSave={(payload) => save("openai", payload)}
        onTest={() => test("openai")}
      />

      <IntegrationCard
        service="rapidapi"
        icon={<Search className="h-5 w-5" />}
        title="Live Web Search (RapidAPI)"
        subtitle="Lets the AI and Best Suppliers page browse the web in real time."
        color="from-purple-500 to-pink-600"
        hasKey={has.RAPIDAPI_KEY}
        status={svc("rapidapi")}
        fields={[
          { key: "RAPIDAPI_KEY", label: "RapidAPI Key", placeholder: "Paste key", href: "https://rapidapi.com/auth/sign-up", hrefLabel: "Free signup" },
        ]}
        form={form} setForm={setForm} show={show} setShow={setShow}
        saving={saving === "rapidapi"} testing={testing === "rapidapi"}
        onSave={(payload) => save("rapidapi", payload)}
        onTest={() => test("rapidapi")}
        builtIn="Curated results"
        instructions={[
          "Create a free RapidAPI account",
          "Search for 'google-search1' and subscribe (free tier = 100 req/day)",
          "From the 'Code' panel, copy the X-RapidAPI-Key value",
          "Paste it here and Save",
        ]}
      />

      <IntegrationCard
        service="shopify"
        icon={<ShoppingCart className="h-5 w-5" />}
        title="Shopify Store"
        subtitle="Sync products & orders with your real Shopify store."
        color="from-green-500 to-emerald-600"
        hasKey={has.SHOPIFY_STORE && has.SHOPIFY_ACCESS_TOKEN}
        status={svc("shopify")}
        fields={[
          { key: "SHOPIFY_STORE", label: "Store domain", placeholder: "your-store.myshopify.com" },
          { key: "SHOPIFY_ACCESS_TOKEN", label: "Admin API access token", placeholder: "shpat_...", href: "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens", hrefLabel: "How to create" },
        ]}
        form={form} setForm={setForm} show={show} setShow={setShow}
        saving={saving === "shopify"} testing={testing === "shopify"}
        onSave={(payload) => save("shopify", payload)}
        onTest={() => test("shopify")}
        instructions={[
          "In Shopify Admin: Settings → Apps and sales channels → Develop apps",
          "Create a new app, enable Admin API with read_products, write_products, read_orders, write_orders",
          "Install the app and copy the Admin API access token",
          "Paste both the store domain and token and Save",
        ]}
      />

      <IntegrationCard
        service="cj"
        icon={<Sparkles className="h-5 w-5" />}
        title="CJ Dropshipping"
        subtitle="Source products and auto-fulfill orders with CJ."
        color="from-orange-500 to-red-600"
        hasKey={has.CJ_EMAIL}
        status={svc("cj")}
        fields={[
          { key: "CJ_EMAIL", label: "CJ account email", placeholder: "you@example.com" },
          { key: "CJ_PASSWORD", label: "CJ password", placeholder: "••••••••", password: true },
          { key: "CJ_API_KEY", label: "API key (optional)", placeholder: "From CJ dashboard" },
        ]}
        form={form} setForm={setForm} show={show} setShow={setShow}
        saving={saving === "cj"} testing={testing === "cj"}
        onSave={(payload) => save("cj", payload)}
        onTest={() => test("cj")}
        instructions={[
          "Sign up free at cjdropshipping.com",
          "Paste your CJ email and password",
          "For full API sync, generate an API key in CJ My Account → API",
        ]}
      />
    </div>
  );
}

interface FieldDef { key: string; label: string; placeholder: string; password?: boolean; href?: string; hrefLabel?: string }

function IntegrationCard({
  icon, title, subtitle, color, hasKey, status, fields, form, setForm, show, setShow,
  saving, testing, onSave, onTest, instructions, builtIn,
}: {
  service: string; icon: React.ReactNode; title: string; subtitle: string; color: string;
  hasKey?: boolean; status?: ServiceStatus; fields: FieldDef[];
  form: Record<string, string>; setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  show: Record<string, boolean>; setShow: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  saving: boolean; testing: boolean; onSave: (payload: Record<string, string>) => void; onTest: () => void;
  instructions?: string[]; builtIn?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const canSave = fields.some((f) => (form[f.key] || "").trim().length > 0);
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shrink-0`}>{icon}</div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              {title}
              {status ? (
                status.ok ? <Badge tone="green" className="gap-1"><CheckCircle2 className="h-3 w-3" />Connected</Badge>
                  : <Badge tone="red" className="gap-1"><XCircle className="h-3 w-3" />Failed</Badge>
              ) : hasKey ? <Badge tone="yellow" className="gap-1"><AlertCircle className="h-3 w-3" />Saved, not tested</Badge>
                : builtIn ? <Badge tone="green" className="gap-1"><CheckCircle2 className="h-3 w-3" />{builtIn}</Badge>
                : <Badge tone="gray">Not connected</Badge>}
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
            {status?.message && <p className={cn("text-xs mt-1", status.ok ? "text-emerald-700" : "text-red-600")}>{status.message}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {fields.map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between">
                <Label>{f.label}</Label>
                {f.href && <a href={f.href} target="_blank" rel="noreferrer" className="text-[11px] text-brand-600 hover:underline inline-flex items-center gap-0.5">{f.hrefLabel}<ExternalLink className="h-3 w-3" /></a>}
              </div>
              <div className="relative mt-1">
                <Input type={f.password && !show[f.key] ? "password" : "text"} value={form[f.key] || ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className={cn(f.password && "pr-10")} />
                {f.password && (
                  <button type="button" onClick={() => setShow((s) => ({ ...s, [f.key]: !s[f.key] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-400">
                    {show[f.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-brand-700 list-none flex items-center gap-1 hover:underline">
            <Key className="h-3.5 w-3.5" /> How to get these keys
          </summary>
          <ol className="mt-2 space-y-1.5">
            {(instructions || []).map((step, i) => (
              <li key={i} className="text-xs text-ink-600 flex gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-brand-100 text-brand-700 text-[9px] font-bold flex items-center justify-center">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </details>

        <div className="flex gap-2 pt-1">
          <Button onClick={() => onSave(Object.fromEntries(fields.map((f) => [f.key, form[f.key] || ""])))}
            disabled={!canSave || saving} loading={saving}>
            {hasKey ? "Update & verify" : "Save & verify"}
          </Button>
          {hasKey && (
            <Button variant="secondary" onClick={onTest} disabled={testing} loading={testing}>
              <RefreshCw className={cn("h-4 w-4", testing && "animate-spin")} /> Test connection
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
