"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useQuery } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { AiChat } from "@/components/ai/ai-chat";

function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { data } = useQuery<{ counts: { pendingOrders: number } }>("/api/dashboard");

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:block w-64 border-r border-ink-100 bg-white p-5">
          <Skeleton className="h-9 w-32 mb-8" />
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-9 w-full mb-2" />)}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar open={open} onClose={() => setOpen(false)} pendingOrders={data?.counts?.pendingOrders} />
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</main>
        <AiChat />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
