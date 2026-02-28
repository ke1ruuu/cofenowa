"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAdminStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const sixtyDaysAgo = new Date(
        now.getTime() - 60 * 24 * 60 * 60 * 1000,
      ).toISOString();

      // 1. Fetch Stats
      const [
        { count: totalProducts },
        { count: prevProducts },
        { count: totalOrders },
        { count: recentOrdersCount },
        { count: prevOrdersCount },
        { count: totalCustomers },
        { count: recentCustomers },
        { count: prevCustomers },
        { data: revenueData },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("created_at", thirtyDaysAgo),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gt("created_at", thirtyDaysAgo),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gt("created_at", sixtyDaysAgo)
          .lt("created_at", thirtyDaysAgo),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .neq("role", "admin"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .neq("role", "admin")
          .gt("created_at", thirtyDaysAgo),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .neq("role", "admin")
          .gt("created_at", sixtyDaysAgo)
          .lt("created_at", thirtyDaysAgo),
        supabase.from("orders").select("total_amount, created_at"),
      ]);

      // 2. Calculations
      const productChange = prevProducts
        ? Math.round(((totalProducts! - prevProducts) / prevProducts) * 100)
        : totalProducts! * 100;
      const orderChange = prevOrdersCount
        ? Math.round(
            ((recentOrdersCount! - prevOrdersCount) / prevOrdersCount) * 100,
          )
        : recentOrdersCount! * 100;
      const customerChange = prevCustomers
        ? Math.round(((recentCustomers! - prevCustomers) / prevCustomers) * 100)
        : recentCustomers! * 100;

      const totalRevenue =
        revenueData?.reduce(
          (acc, o) => acc + (Number(o.total_amount) || 0),
          0,
        ) || 0;
      const recentRevenue =
        revenueData
          ?.filter((o) => o.created_at > thirtyDaysAgo)
          .reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0;
      const prevRevenue =
        revenueData
          ?.filter(
            (o) => o.created_at > sixtyDaysAgo && o.created_at <= thirtyDaysAgo,
          )
          .reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0) || 0;
      const revenueChange = prevRevenue
        ? Math.round(((recentRevenue - prevRevenue) / prevRevenue) * 100)
        : recentRevenue > 0
          ? 100
          : 0;

      setStats([
        {
          name: "Total Products",
          value: totalProducts || 0,
          icon: "coffee",
          change: `${productChange >= 0 ? "+" : ""}${productChange}%`,
          changeType: productChange >= 0 ? "increase" : "decrease",
        },
        {
          name: "Total Orders",
          value: totalOrders || 0,
          icon: "shoppingBag",
          change: `${orderChange >= 0 ? "+" : ""}${orderChange}%`,
          changeType: orderChange >= 0 ? "increase" : "decrease",
        },
        {
          name: "Total Customers",
          value: totalCustomers || 0,
          icon: "users",
          change: `${customerChange >= 0 ? "+" : ""}${customerChange}%`,
          changeType: customerChange >= 0 ? "increase" : "decrease",
        },
        {
          name: "Revenue",
          value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: "trendingUp",
          change: `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`,
          changeType: revenueChange >= 0 ? "increase" : "decrease",
        },
      ]);

      // 3. Recent Orders
      const { data: recent } = await supabase
        .from("orders")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentOrders(recent || []);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, recentOrders, isLoading, refetch: fetchDashboardData };
}
