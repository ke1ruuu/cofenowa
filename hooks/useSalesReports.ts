"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
  isAfter,
} from "date-fns";

export type TimeFilter = "daily" | "weekly" | "monthly";

export function useSalesReports(filter: TimeFilter = "monthly") {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Determine time range and grouping based on filter
      const now = new Date();
      let startDate: Date;
      let dateFormat: string;

      switch (filter) {
        case "daily":
          startDate = subDays(now, 14); // Last 14 days
          dateFormat = "MMM dd";
          break;
        case "weekly":
          startDate = subWeeks(now, 12); // Last 12 weeks
          dateFormat = "'Week' w, MMM";
          break;
        case "monthly":
        default:
          startDate = subMonths(now, 6); // Last 6 months
          dateFormat = "MMM yy";
          break;
      }

      // 2. Fetch Orders and Products
      const [
        { data: orders, error: ordersError },
        { data: products, error: productsError },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select(
            "id, total_amount, status, created_at, order_items(product_name, quantity, subtotal)",
          )
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: true }),
        supabase.from("products").select("name, categories(name)"),
      ]);

      if (ordersError) throw ordersError;
      if (productsError) throw productsError;

      // 3. Setup Mapping & Aggregation
      const categoryMap: Record<string, string> = {};
      products?.forEach((p) => {
        categoryMap[p.name] = (p.categories as any)?.name || "Uncategorized";
      });

      const trendMap: Record<string, number> = {};
      const productSalesDict: Record<
        string,
        { quantity: number; revenue: number }
      > = {};
      const categorySalesDict: Record<string, number> = {};

      orders?.forEach((order) => {
        const date = new Date(order.created_at);
        const timeKey = format(date, dateFormat);

        // Revenue Trend aggregation
        trendMap[timeKey] =
          (trendMap[timeKey] || 0) + Number(order.total_amount);

        // Product & Category aggregation
        order.order_items.forEach((item: any) => {
          if (!productSalesDict[item.product_name]) {
            productSalesDict[item.product_name] = { quantity: 0, revenue: 0 };
          }
          productSalesDict[item.product_name].quantity += item.quantity;
          productSalesDict[item.product_name].revenue += Number(item.subtotal);

          const catName = categoryMap[item.product_name] || "Uncategorized";
          categorySalesDict[catName] =
            (categorySalesDict[catName] || 0) + Number(item.subtotal);
        });
      });

      // 4. Format outputs
      const trendData = Object.entries(trendMap).map(([time, revenue]) => ({
        time,
        revenue: Number(revenue.toFixed(2)),
      }));

      const catData = Object.entries(categorySalesDict)
        .map(([name, revenue]) => ({
          name,
          revenue: Number(revenue.toFixed(2)),
        }))
        .sort((a, b) => b.revenue - a.revenue);

      const productsData = Object.entries(productSalesDict)
        .map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: Number(stats.revenue.toFixed(2)),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setRevenueTrend(trendData);
      setTopProducts(productsData);
      setSalesByCategory(catData);
    } catch (err: any) {
      console.error("Error generating reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filter]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return {
    revenueTrend,
    topProducts,
    salesByCategory,
    isLoading,
    refetch: fetchReportData,
  };
}
