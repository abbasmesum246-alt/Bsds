"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui/dropdown";
import { useAuth } from "@/components/auth-provider";
import { useQuery } from "@/hooks/use-api";
import { timeAgo } from "@/lib/utils";

interface ActivityItem { id: string; message: string; createdAt: string; }

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data } = useQuery<{ items: ActivityItem[] }>("/api/activities?limit=6");
  const [notifOpen, setNotifOpen] = React.useState(false);
  if (!user) return null;
  const activities = data?.items ?? [];

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const q = (e.target as HTMLInputElement).value.trim();
      if (q) router.push("/dashboard/products?q=" + encodeURIComponent(q));
    }
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur border-b border-ink-100">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-lg text-ink-600 hover:bg-ink-100" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        <div className="relative flex-1 max-w-xl hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input type="search" placeholder="Search products, orders, customers..." onKeyDown={onSearchKey}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-ink-50 border border-transparent focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition" />
        </div>
        <div className="flex-1 sm:hidden" />
        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} className="relative p-2 rounded-lg text-ink-600 hover:bg-ink-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {activities.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-pop ring-1 ring-ink-100 z-40 animate-fade-in">
                <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
                  <p className="font-semibold text-sm">Activity</p>
                  <span className="text-xs text-ink-400">Recent</span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {activities.length === 0 && <p className="px-4 py-8 text-center text-sm text-ink-400">No recent activity</p>}
                  {activities.map((a) => (
                    <div key={a.id} className="px-4 py-2.5 hover:bg-ink-50 flex gap-3">
                      <span className="h-2 w-2 mt-1.5 rounded-full bg-brand-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-ink-700 leading-snug line-clamp-2">{a.message}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{timeAgo(a.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-ink-100 transition">
              <Avatar name={user.name} color={user.avatarColor} size={32} />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-ink-900 leading-tight">{user.name}</p>
                <p className="text-xs text-ink-500 leading-tight">{user.plan} plan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-ink-400 hidden md:block" />
            </button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>{user.email}</DropdownLabel>
            <DropdownItem icon={<UserIcon className="h-4 w-4" />}><Link href="/dashboard/settings">Profile</Link></DropdownItem>
            <DropdownItem icon={<Settings className="h-4 w-4" />}><Link href="/dashboard/settings">Settings</Link></DropdownItem>
            <DropdownSeparator />
            <DropdownItem danger icon={<LogOut className="h-4 w-4" />} onClick={logout}>Sign out</DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}
