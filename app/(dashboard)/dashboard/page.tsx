"use client";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { DollarSign, ShoppingCart, TrendingUp, Package, ArrowRight, Clock, AlertTriangle, PackageX } from "lucide-react";
import { useQuery } from "@/hooks/use-api";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const { data, loading } = useQuery<DashboardStats>("/api/dashboard");

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><Skeleton className="h-80 lg:col-span-2" /><Skeleton className="h-80" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" description="Welcome back — here's what's happening across your stores today."
        action={<Link href="/dashboard/products" className="inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-3.5 py-2 text-sm font-medium hover:bg-brand-700"><Package className="h-4 w-4" />Import product</Link>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue (30 days)" value={formatCurrency(data.revenue)} delta={data.revenueDelta} icon={<DollarSign className="h-5 w-5" />} tone="teal" />
        <StatCard label="Orders" value={data.orders} delta={data.ordersDelta} icon={<ShoppingCart className="h-5 w-5" />} tone="indigo" />
        <StatCard label="Net profit" value={formatCurrency(data.profit)} delta={data.profitDelta} icon={<TrendingUp className="h-5 w-5" />} tone="violet" />
        <StatCard label="Active products" value={data.products} delta={data.productsDelta} icon={<Package className="h-5 w-5" />} tone="sky" />
      </div>

      {(data.counts.pendingOrders > 0 || data.counts.lowStock > 0 || data.counts.outOfStock > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.counts.pendingOrders > 0 && <AlertCard tone="amber" icon={<Clock className="h-4 w-4" />} label="Orders awaiting fulfillment" value={data.counts.pendingOrders} href="/dashboard/orders?status=pending" />}
          {data.counts.lowStock > 0 && <AlertCard tone="blue" icon={<AlertTriangle className="h-4 w-4" />} label="Low-stock products" value={data.counts.lowStock} href="/dashboard/products" />}
          {data.counts.outOfStock > 0 && <AlertCard tone="red" icon={<PackageX className="h-4 w-4" />} label="Out of stock" value={data.counts.outOfStock} href="/dashboard/products?status=out_of_stock" />}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Revenue</CardTitle><p className="text-sm text-ink-500 mt-0.5">Last 14 days</p></div>
            <Badge tone="teal"><TrendingUp className="h-3 w-3" />{data.revenueDelta.toFixed(1)}%</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueSeries} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                  <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3563ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#3563ff" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fontSize: 12, fill: "#8590a8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#8590a8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} labelFormatter={(l) => formatDateTime(l as string)} contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", boxShadow: "0 8px 24px rgba(16,24,40,.08)" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3563ff" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Order status</CardTitle><p className="text-sm text-ink-500 mt-0.5">All-time breakdown</p></CardHeader>
          <CardContent>
            {data.statusBreakdown.length === 0 ? (
              <EmptyState compact icon={<ShoppingCart className="h-6 w-6" />} title="No orders yet" />
            ) : (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                        {data.statusBreakdown.map((e) => <Cell key={e.name} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number, n: string) => [`${v} orders`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {data.statusBreakdown.map((s) => (
                    <div key={s.name} className="flex items-center gap-2 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="capitalize text-ink-600">{s.name.replace(/_/g, " ")}</span>
                      <span className="ml-auto font-semibold text-ink-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Top products</CardTitle><p className="text-sm text-ink-500 mt-0.5">By revenue, last 90 days</p></div>
            <Link href="/dashboard/products" className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.topProducts.length === 0 ? <EmptyState compact icon={<Package className="h-6 w-6" />} title="No product sales yet" /> : (
              <div className="divide-y divide-ink-100">
                {data.topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="text-sm font-bold text-ink-300 w-5">{i + 1}</span>
                    <div className="h-11 w-11 rounded-lg bg-ink-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${p.image}")` }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-900 truncate">{p.title}</p>
                      <p className="text-xs text-ink-500">{formatNumber(p.sold)} sold</p>
                    </div>
                    <div className="text-right"><p className="text-sm font-semibold text-ink-900">{formatCurrency(p.revenue)}</p><p className="text-xs text-emerald-600">revenue</p></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Store performance</CardTitle><p className="text-sm text-ink-500 mt-0.5">Revenue by store</p></CardHeader>
          <CardContent>
            {data.storePerformance.length === 0 ? <EmptyState compact icon={<Package className="h-6 w-6" />} title="Connect a store" /> : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.storePerformance} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "#65718c" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} cursor={{ fill: "#f6f7f9" }} />
                    <Bar dataKey="revenue" fill="#3563ff" radius={[0, 6, 6, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AlertCard({ tone, icon, label, value, href }: { tone: "amber" | "blue" | "red"; icon: React.ReactNode; label: string; value: number; href: string }) {
  const tones = { amber: "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100", blue: "bg-sky-50 text-sky-700 ring-sky-200 hover:bg-sky-100", red: "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100" };
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 ring-inset transition ${tones[tone]}`}>
      <span className="h-9 w-9 rounded-lg bg-white/60 flex items-center justify-center">{icon}</span>
      <div><p className="text-sm font-semibold leading-tight">{value}</p><p className="text-xs opacity-80 leading-tight">{label}</p></div>
      <ArrowRight className="h-4 w-4 ml-auto opacity-60" />
    </Link>
  );
}
