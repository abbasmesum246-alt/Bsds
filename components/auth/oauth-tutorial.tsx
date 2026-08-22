"use client";
import * as React from "react";
import { CheckCircle2, Copy, ExternalLink, Github, ChevronDown, ChevronUp, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export function GithubTutorial() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";
  const callbackUrl = `${origin}/api/auth/callback/github`;

  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Key className="h-4 w-4 text-slate-500" /> How to enable GitHub sign-in (2 min, free)
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          <Step n={1} title="Create a GitHub OAuth App">
            Go to{" "}
            <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold inline-flex items-center gap-0.5 hover:underline">
              github.com/settings/developers <ExternalLink className="h-3 w-3" />
            </a>
            {" "}→ <strong>OAuth Apps</strong> → <strong>New OAuth App</strong>.
          </Step>
          <Step n={2} title="Fill the form">
            <div className="space-y-2 mt-1.5">
              <Field label="Application name" value="BSD Business Suite" onCopy={() => copy("BSD Business Suite", "name")} copied={copied === "name"} />
              <Field label="Homepage URL" value={origin} onCopy={() => copy(origin, "home")} copied={copied === "home"} />
              <Field label="Authorization callback URL" value={callbackUrl} onCopy={() => copy(callbackUrl, "cb")} copied={copied === "cb"} mono />
            </div>
          </Step>
          <Step n={3} title="Get your credentials">
            Click <strong>Register application</strong>. On the next page, click <strong>Generate a new client secret</strong>.
            Copy the <em>Client ID</em> and <em>Client secret</em>.
          </Step>
          <Step n={4} title="Add them to your host">
            In Vercel → Project → Settings → Environment Variables, add:
            <Code>GITHUB_ID=your_client_id</Code>
            <Code>GITHUB_SECRET=your_client_secret</Code>
            Then redeploy. The button turns green and logs users in for real.
          </Step>
          <p className="text-xs text-slate-500 pt-1">💡 You can do this later — email & demo login work right now.</p>
        </div>
      )}
    </div>
  );
}

export function GoogleTutorial() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";
  const callbackUrl = `${origin}/api/auth/callback/google`;

  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition text-left">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Key className="h-4 w-4 text-slate-500" /> How to enable Google sign-in (3 min, free)
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          <Step n={1} title="Create a Google Cloud project">
            Go to{" "}
            <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold inline-flex items-center gap-0.5 hover:underline">
              console.cloud.google.com <ExternalLink className="h-3 w-3" />
            </a>
            {" "}and create a new project (any name).
          </Step>
          <Step n={2} title="Configure OAuth consent">
            Go to <strong>APIs & Services → OAuth consent screen</strong>. Choose <strong>External</strong>, fill app name ("BSD"), support email, and add your domain under <em>Authorized domains</em>. Publish to Testing.
          </Step>
          <Step n={3} title="Create credentials">
            Go to <strong>Credentials → Create Credentials → OAuth client ID</strong>. Choose <strong>Web application</strong>. Under <em>Authorized redirect URIs</em> add:
            <div className="mt-1.5"><Field label="" value={callbackUrl} onCopy={() => copy(callbackUrl, "gcb")} copied={copied === "gcb"} mono /></div>
          </Step>
          <Step n={4} title="Add to Vercel">
            Copy the Client ID and Client secret, then add environment variables:
            <Code>GOOGLE_ID=your_client_id</Code>
            <Code>GOOGLE_SECRET=your_client_secret</Code>
            Redeploy. The Google button will work for real.
          </Step>
        </div>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{n}</span>
      <div>
        <p className="font-semibold text-slate-800 text-[13px]">{title}</p>
        <div className="text-slate-600 text-[13px] mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onCopy, copied, mono }: { label: string; value: string; onCopy: () => void; copied: boolean; mono?: boolean }) {
  return (
    <div>
      {label && <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>}
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 p-2">
        <code className={cn("text-xs flex-1 break-all text-slate-700", mono && "font-mono")}>{value}</code>
        <button onClick={onCopy} className="p-1 rounded hover:bg-slate-200 text-slate-500 shrink-0" title="Copy">
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <pre className="bg-slate-900 text-emerald-300 text-[11px] p-2 rounded-lg mt-1.5 overflow-x-auto font-mono">{children}</pre>;
}
