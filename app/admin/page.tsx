"use client";

import { useAdminStats } from "@/hooks/useAdminStats";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { DashboardActions } from "@/components/admin/DashboardActions";
import { Loader2 } from "lucide-react";

export default function AdminDashboardOverview() {
  const { stats, recentOrders, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f27f0d]" />
      </div>
    );
  }

  const typedStats = stats.map((s) => ({
    ...s,
    changeType: s.changeType as "increase" | "decrease" | "neutral",
  }));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-[#181411]">
          Dashboard Overview
        </h1>
        <p className="text-[#8a7560] font-medium mt-2">
          Welcome back. Here is your coffee shop performance at a glance.
        </p>
      </div>

      <StatsGrid initialStats={typedStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <DashboardActions />
        </div>
      </div>
    </div>
  );
}
