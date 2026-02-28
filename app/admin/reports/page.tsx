"use client";

import { useSalesReports, TimeFilter } from "@/hooks/useSalesReports";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  Loader2,
  Trophy,
  Layers,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COLORS = ["#f27f0d", "#181411", "#8a7560", "#e6e0db", "#a38f7a"];

export default function SalesReportsPage() {
  const [filter, setFilter] = useState<TimeFilter>("monthly");
  const { revenueTrend, topProducts, salesByCategory, isLoading } =
    useSalesReports(filter);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8f7f5]">
        <Loader2 className="h-10 w-10 animate-spin text-[#f27f0d]" />
      </div>
    );
  }

  const filters: { value: TimeFilter; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f5] p-6 md:p-10 space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="flex items-center gap-2 text-[#8a7560] font-black uppercase tracking-widest text-[9px] mb-2 hover:text-[#181411] transition-colors"
          >
            <ArrowLeft className="h-2.5 w-2.5" />
            Back
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-[#181411]">
            Sales Performance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Selector */}
          <div className="bg-white p-1 rounded-xl border border-[#e6e0db] shadow-sm flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f.value
                    ? "bg-[#181411] text-white shadow-md"
                    : "text-[#8a7560] hover:bg-[#f8f7f5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            className="bg-[#181411] text-white hover:bg-black rounded-xl h-10 px-4 font-black flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
      </div>

      {/* Row 1: Revenue Analysis Area Chart (Full Width) */}
      <div className="bg-white rounded-[2rem] border border-[#e6e0db] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2 text-[#181411]">
              <TrendingUp className="h-5 w-5 text-[#f27f0d]" />
              Revenue Growth
            </h2>
            <p className="text-[10px] font-bold text-[#8a7560] mt-1 uppercase tracking-widest">
              Aggregate revenue tracking based on {filter} metrics
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#f27f0d]/5 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#f27f0d]" />
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f27f0d" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f27f0d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f2ede8"
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#8a7560" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#8a7560" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "1rem",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#f27f0d",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f27f0d"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{
                  r: 6,
                  fill: "#f27f0d",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Metrics Side-by-Side (Category + Quick Info) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Split */}
        <div className="bg-[#181411] rounded-[2rem] p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Layers className="h-32 w-32" />
          </div>
          <h2 className="text-sm font-black flex items-center gap-2 mb-4 relative z-10 uppercase tracking-widest text-white/50">
            <Layers className="h-4 w-4 text-[#f27f0d]" />
            Category Breakdown
          </h2>
          <div className="grid grid-cols-2 items-center gap-4 relative z-10">
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={4}
                    dataKey="revenue"
                    stroke="none"
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {salesByCategory.slice(0, 3).map((cat, idx) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-[10px] font-bold text-white/60 truncate max-w-[80px]">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-black">${cat.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="bg-[#f27f0d] rounded-[2rem] p-6 text-white flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -left-4 -bottom-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">
              Inventory Spotlight
            </h3>
            <p className="text-xl font-black leading-tight max-w-[200px]">
              {topProducts[0]?.name || "Top Product"}
            </p>
            <p className="text-[10px] opacity-80 mt-1 font-medium">
              Currently your highest earning item.
            </p>
          </div>
          <div className="h-16 w-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center relative z-10 border border-white/20">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Row 3: Performance Table (Full Width) */}
      <div className="bg-white rounded-[2rem] border border-[#e6e0db] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#f2ede8] flex items-center justify-between">
          <h2 className="text-lg font-black flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#f27f0d]" />
            Best Sellers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f7f5]/50 text-[9px] font-black uppercase tracking-widest text-[#8a7560]">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Volume</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3 text-right">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2ede8]">
              {topProducts.map((product, idx) => (
                <tr
                  key={product.name}
                  className="hover:bg-[#f8f7f5]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#f27f0d] bg-[#f27f0d]/5 h-6 w-6 rounded-lg flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-[#181411]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-[#8a7560]">
                    {product.quantity} units
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-[#181411]">
                    ${product.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-1.5 w-20 bg-[#f8f7f5] rounded-full inline-block overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-[#f27f0d]"
                        style={{
                          width: `${(product.revenue / (topProducts[0]?.revenue || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
