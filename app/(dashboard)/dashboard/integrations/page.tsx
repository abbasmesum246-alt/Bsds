"use client";
import * as React from "react";
import {
  Puzzle, Key, CheckCircle2, ExternalLink, Bot, Search, ShoppingCart,
  Sparkles, AlertCircle, Eye, EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { api } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface Status {
  groq: boolean; openai: boolean; shopify: boolean; cj: boolean; aliexpress: boolean;
}

export default function IntegrationsPage() {
  const toast = useToast();
  const [status, setStatus] = React.useState<Status | null>(null);
  const [saving, setSaving] = React.useState<string | null>(null);
  const [show, setShow] = React.useState<Record<string, boolean>>({});

  // form fields
  const [groq, setGroq] = React.useState("");
  const [openai, setOpenai] = React.useState("");
  const [shopifyStore, setShopifyStore] = React.useState("");
  const [shopifyToken, setShopifyToken] = React.useState("");
  const [cjKey, setCjKey] = React.useState("");
  const [cjEmail, setCjEmail] = React.useState("");
  const [cjPass, setCjPass] = React.useState("");
  const [rapid, setRapid] = React.useState("");

  React.useEffect(() => {
    api.get<{ status: Status }>("/api/integrations").then((r) => setStatus(r.status)).catch(() => {});
  }, []);

  async function save(section: string, payload: Record<string, string>) {
    setSaving(section);
    try {
      const r = await api.post<{ ok: boolean; status: Status }>("/api/integrations", payload);
      setStatus(r.status);
      toast.success("Saved", "Your key is stored encrypted on the server.");
      // clear fields after save
      if (section === "groq") setGroq("");
      if (section === "openai") setOpenai("");
      if (section === "shopify") { setShopifyStore(""); setShopifyToken(""); }
      if (section === "cj") { setCjKey(""); setCjEmail(""); setCjPass(""); }
      if (section === "rapid") setRapid("");
    } catch (e) {
      toast.error("Save failed", (e as Error).message);
    } finally { setSaving(null); }
  }

  if (!status) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-5 animate-in">
      <PageHeader
        title="Integrations"
        description="Connect real services. API keys are encrypted and never shown in the browser."
        icon={<Puzzle className="h-5 w-5" />}
      />

      {/* AI */}
      <IntegrationCard
        connected={status.groq || status.openai}
        icon={<Bot className="h-5 w-5" />}
        title="AI Assistant"
        subtitle="Powers the BSDS AI chatbot — real-time answers + actions."
        badges={[
          { label: "Recommended · Free", tone: "green" as const, link: "https://console.groq.com/keys" },
          { label: "Alternative", tone: "gray" as const, link: "https://platform.openai.com/api-keys" },
        ]}
      >
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              Groq API Key <Badge tone={status.groq ? "green" : "gray"}>{status.groq ? "Connected" : "Not connected"}</Badge>
            </Label>
            <p className="text-xs text-ink-500 mb-2">
              Free, fast (Llama 70B). Get a key at{" "}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-brand-600 underline">console.groq.com/keys</a>
            </p>
            <KeyInput value={groq} onChange={setGroq} show={!!show.groq} onToggle={() => setShow((s) => ({ ...s, groq: !s.groq }))} placeholder="gsk_..." />
            <Button size="sm" className="mt-2" disabled={!groq || saving === "groq"} loading={saving === "groq"} onClick={() => save("groq", { GROQ_API_KEY: groq })}>
              {status.groq ? "Update Groq key" : "Connect Groq"}
            </Button>
          </div>
          <div className="border-t border-ink-100 pt-4">
            <Label className="flex items-center gap-2">
              OpenAI API Key (optional) <Badge tone={status.openai ? "green" : "gray"}>{status.openai ? "Connected" : "Not connected"}</Badge>
            </Label>
            <p className="text-xs text-ink-500 mb-2">Used only if Groq is not set. Get a key at{" "}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-brand-600 underline">platform.openai.com</a>
            </p>
            <KeyInput value={openai} onChange={setOpenai} show={!!show.openai} onToggle={() => setShow((s) => ({ ...s, openai: !s.openai }))} placeholder="sk-..." />
            <Button size="sm" variant="secondary" className="mt-2" disabled={!openai || saving === "openai"} loading={saving === "openai"} onClick={() => save("openai", { OPENAI_API_KEY: openai })}>
              {status.openai ? "Update OpenAI key" : "Connect OpenAI"}
            </Button>
          </div>
        </div>
      </IntegrationCard>

      {/* Live web search */}
      <IntegrationCard
        connected={status.aliexpress}
        icon={<Search className="h-5 w-5" />}
        title="Live Web Search"
        subtitle="Shows real-time supplier reviews on the Best Suppliers page."
        badges={[{ label: "Optional · Free tier", tone: "blue", link: "https://rapidapi.com" }]}
      >
        <Label className="flex items-center gap-2">
          RapidAPI Key <Badge tone={status.aliexpress ? "green" : "gray"}>{status.aliexpress ? "Connected" : "Not connected"}</Badge>
        </Label>
        <p className="text-xs text-ink-500 mb-2">
          Get a free key from{" "}
          <a href="https://rapidapi.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">rapidapi.com</a>
          {" "}and subscribe to the &quot;google-search1&quot; API.
        </p>
        <KeyInput value={rapid} onChange={setRapid} show={!!show.rapid} onToggle={() => setShow((s) => ({ ...s, rapid: !s.rapid }))} placeholder="Paste RapidAPI key" />
        <Button size="sm" className="mt-2" disabled={!rapid || saving === "rapid"} loading={saving === "rapid"} onClick={() => save("rapid", { RAPIDAPI_KEY: rapid })}>
          {status.aliexpress ? "Update key" : "Enable web search"}
        </Button>
      </IntegrationCard>

      {/* Shopify */}
      <IntegrationCard
        connected={status.shopify}
        icon={<ShoppingCart className="h-5 w-5" />}
        title="Shopify Store"
        subtitle="Sync products and orders with your real Shopify store."
        badges={[{ label: "Requires Shopify store", tone: "gray", link: "https://shopify.com" }]}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Store domain</Label>
            <Input value={shopifyStore} onChange={(e) => setShopifyStore(e.target.value)} placeholder="your-store.myshopify.com" />
          </div>
          <div>
            <Label>Admin API access token</Label>
            <KeyInput value={shopifyToken} onChange={setShopifyToken} show={!!show.shopify} onToggle={() => setShow((s) => ({ ...s, shopify: !s.shopify }))} placeholder="shpat_..." />
          </div>
        </div>
        <p className="text-xs text-ink-500 mt-2 flex gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Create a custom app in Shopify Admin → Settings → Apps and enable read_products, write_products, read_orders, write_orders.
        </p>
        <Button size="sm" className="mt-3" disabled={!shopifyStore || !shopifyToken || saving === "shopify"} loading={saving === "shopify"} onClick={() => save("shopify", { SHOPIFY_STORE: shopifyStore, SHOPIFY_ACCESS_TOKEN: shopifyToken })}>
          {status.shopify ? "Update Shopify" : "Connect Shopify"}
        </Button>
      </IntegrationCard>

      {/* CJ Dropshipping */}
      <IntegrationCard
        connected={status.cj}
        icon={<Sparkles className="h-5 w-5" />}
        title="CJ Dropshipping"
        subtitle="Auto-source products and place orders with CJ fulfillment."
        badges={[{ label: "Free to join", tone: "green", link: "https://cjdropshipping.com" }]}
      >
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>API Key</Label><KeyInput value={cjKey} onChange={setCjKey} show={!!show.cj} onToggle={() => setShow((s) => ({ ...s, cj: !s.cj }))} placeholder="CJ API key" /></div>
          <div><Label>Email</Label><Input value={cjEmail} onChange={(e) => setCjEmail(e.target.value)} placeholder="CJ account email" /></div>
          <div><Label>Password</Label><KeyInput value={cjPass} onChange={setCjPass} show={!!show.cjp} onToggle={() => setShow((s) => ({ ...s, cjp: !s.cjp }))} placeholder="CJ password" /></div>
        </div>
        <Button size="sm" className="mt-3" disabled={!cjKey || saving === "cj"} loading={saving === "cj"} onClick={() => save("cj", { CJ_API_KEY: cjKey, CJ_EMAIL: cjEmail, CJ_PASSWORD: cjPass })}>
          {status.cj ? "Update CJ" : "Connect CJ"}
        </Button>
      </IntegrationCard>

      <Card className="border-dashed">
        <CardContent className="p-5 text-sm text-ink-600 flex gap-3">
          <Key className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink-900 mb-1">How keys are stored</p>
            <p>Keys are encrypted with AES-256 before being saved. They are only sent to the official
              API endpoints you see above — never to any third party. You can remove a key at any time
              by clearing the field and saving.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationCard({
  connected, icon, title, subtitle, badges, children,
}: {
  connected: boolean; icon: React.ReactNode; title: string; subtitle: string;
  badges?: { label: string; tone: "green" | "blue" | "gray"; link: string }[];
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", connected ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600")}>{icon}</div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-base">
              {title}
              {connected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            </CardTitle>
            <CardDescription>{subtitle}</CardDescription>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges?.map((b) => (
                <a key={b.label} href={b.link} target="_blank" rel="noreferrer">
                  <Badge tone={b.tone} className="cursor-pointer hover:opacity-80">
                    {b.label}<ExternalLink className="h-3 w-3 ml-0.5" />
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function KeyInput({ value, onChange, show, onToggle, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pr-10 font-mono" />
      <button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
