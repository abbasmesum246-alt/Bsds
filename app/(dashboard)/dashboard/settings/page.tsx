"use client";
import * as React from "react";
import { User as UserIcon, Lock, Bell, CreditCard, Save, Smartphone, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/page-header";
import { api } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = React.useState<"profile" | "security" | "notifications" | "billing" | "app">("profile");
  const [profile, setProfile] = React.useState({ name: user?.name || "", company: user?.company || "", email: user?.email || "" });
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [pwd, setPwd] = React.useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPwd, setSavingPwd] = React.useState(false);
  const [notifications, setNotifications] = React.useState({ orders: true, lowStock: true, priceChanges: true, weeklyReport: true, productReviews: false, marketing: false });
  const [installEvt, setInstallEvt] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallEvt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const currentUser = user;
  if (!currentUser) return null;
  const { id, email, avatarColor, plan, createdAt } = currentUser;

  async function saveProfile() {
    setSavingProfile(true);
    try {
      await api.patch("/api/account", profile);
      setUser({
        id,
        email,
        avatarColor,
        plan,
        createdAt,
        name: profile.name,
        company: profile.company,
      });
      toast.success("Profile updated");
    } catch (err) { toast.error("Update failed", (err as Error).message); } finally { setSavingProfile(false); }
  }

  async function changePassword() {
    if (pwd.newPassword !== pwd.confirmPassword) { toast.error("Passwords don't match"); return; }
    setSavingPwd(true);
    try {
      await api.patch("/api/account", { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success("Password changed");
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast.error("Could not change password", (err as Error).message); } finally { setSavingPwd(false); }
  }

  async function installApp() {
    if (!installEvt) return;
    (installEvt as Event & { prompt: () => void }).prompt();
    toast.success("App installation started");
    setInstallEvt(null);
  }

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: <UserIcon className="h-4 w-4" /> },
    { id: "security" as const, label: "Security", icon: <Lock className="h-4 w-4" /> },
    { id: "notifications" as const, label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "billing" as const, label: "Plan & billing", icon: <CreditCard className="h-4 w-4" /> },
    { id: "app" as const, label: "Mobile app", icon: <Smartphone className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Settings" description="Manage your account, security, and preferences." icon={<UserIcon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="p-2 h-fit">
          <nav className="space-y-0.5">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-5">
          {tab === "profile" && (
            <Card>
              <CardHeader><CardTitle>Profile information</CardTitle><CardDescription>Update your personal details and company.</CardDescription></CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar name={currentUser.name} color={currentUser.avatarColor} size={64} />
                  <div><p className="font-semibold">{currentUser.name}</p><p className="text-sm text-ink-500">{currentUser.email}</p><Badge tone="brand" className="mt-1.5">{currentUser.plan} plan</Badge></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Full name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                  <div><Label>Company</Label><Input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Email</Label><Input value={profile.email} disabled /><p className="text-xs text-ink-400 mt-1">Contact support to change your email.</p></div>
                </div>
                <div className="flex justify-end"><Button onClick={saveProfile} loading={savingProfile}><Save className="h-4 w-4" />Save changes</Button></div>
              </CardContent>
            </Card>
          )}

          {tab === "security" && (
            <Card>
              <CardHeader><CardTitle>Change password</CardTitle><CardDescription>Use a strong, unique password.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Current password</Label><Input type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>New password</Label><Input type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} /></div>
                  <div><Label>Confirm new password</Label><Input type="password" value={pwd.confirmPassword} onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })} /></div>
                </div>
                <div className="flex justify-end"><Button onClick={changePassword} loading={savingPwd}>Update password</Button></div>
              </CardContent>
            </Card>
          )}

          {tab === "notifications" && (
            <Card>
              <CardHeader><CardTitle>Email notifications</CardTitle><CardDescription>Choose what you want to be notified about.</CardDescription></CardHeader>
              <CardContent className="space-y-1">
                {[
                  ["orders", "New orders", "When a customer places an order"],
                  ["lowStock", "Low stock alerts", "When products drop below 15 units"],
                  ["priceChanges", "Supplier price changes", "When a supplier changes cost"],
                  ["weeklyReport", "Weekly performance report", "Monday-morning sales summary"],
                  ["productReviews", "New product reviews", "When customers leave a review"],
                  ["marketing", "Tips & recommendations", "Occasional growth advice"],
                ].map(([k, t, d]) => (
                  <div key={k} className="flex items-center justify-between py-3 border-b border-ink-100 last:border-0">
                    <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-ink-500">{d}</p></div>
                    <Switch checked={notifications[k as keyof typeof notifications]} onChange={(v) => setNotifications((s) => ({ ...s, [k]: v }))} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {tab === "billing" && (
            <Card>
              <CardHeader><CardTitle>Plan &amp; billing</CardTitle><CardDescription>You're on the {currentUser.plan} plan.</CardDescription></CardHeader>
              <CardContent>
                <div className="rounded-xl bg-gradient-to-br from-brand-600 to-violet-700 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-brand-100">Current plan</p><p className="text-2xl font-bold">{currentUser.plan}</p></div>
                    <CreditCard className="h-8 w-8 text-white/60" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-white/10 p-2.5"><p className="text-lg font-bold">5</p><p className="text-xs text-brand-100">Stores</p></div>
                    <div className="rounded-lg bg-white/10 p-2.5"><p className="text-lg font-bold">10k</p><p className="text-xs text-brand-100">Products</p></div>
                    <div className="rounded-lg bg-white/10 p-2.5"><p className="text-lg font-bold">∞</p><p className="text-xs text-brand-100">Orders</p></div>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <Row label="Member since" value={formatDate(currentUser.createdAt)} />
                  <Row label="Billing period" value="Monthly" />
                  <Row label="Next invoice" value="Sep 17, 2026" />
                  <Row label="Payment method" value="Visa •••• 4242" />
                </div>
                <div className="mt-5 flex gap-2"><Button>Upgrade plan</Button><Button variant="secondary">Download invoices</Button></div>
              </CardContent>
            </Card>
          )}

          {tab === "app" && (
            <Card>
              <CardHeader><CardTitle>Mobile app</CardTitle><CardDescription>Install BSDS on your phone for notifications and a native experience.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-ink-200 p-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">B</div>
                  <div className="flex-1"><p className="font-semibold">Install on this device</p><p className="text-sm text-ink-500">Adds BSDS to your home screen. Works offline.</p></div>
                  <Button onClick={installApp} disabled={!installEvt} variant={installEvt ? "primary" : "secondary"}><Smartphone className="h-4 w-4" />Install</Button>
                </div>
                <div className="rounded-xl border border-ink-200 p-4">
                  <p className="font-semibold flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Google Play Store ready</p>
                  <p className="text-sm text-ink-500 mt-1">Run <code className="text-xs bg-ink-100 px-1 rounded">play-store/build-android.sh</code> after deploying to produce a signed uploadable AAB.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink-100 last:border-0">
      <span className="text-ink-500">{label}</span><span className="font-medium">{value}</span>
    </div>
  );
}
