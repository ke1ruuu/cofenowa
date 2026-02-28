"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { OrderRow } from "./OrderRow";
import { ShoppingBag, Loader2 } from "lucide-react";

export function RealtimeOrderList({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // 1. Subscribe to REALTIME changes for the 'orders' table
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("Realtime order change detected:", payload);
          setIsSyncing(true);

          // Re-fetch everything when any change happens to ensure we have the profiles and items joined correctly
          // Supabase Realtime payloads don't include complex joins, so we refetch.
          const { data, error } = await supabase
            .from("orders")
            .select(
              `
                *,
                profiles(full_name, email),
                order_items(
                    *,
                    order_item_addons(*)
                )
            `,
            )
            .order("created_at", { ascending: false });

          if (!error && data) {
            setOrders(data);
          }
          setIsSyncing(false);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] p-20 text-center text-[#8a7560]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-[#f8f7f5] flex items-center justify-center text-black/10">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <p className="font-medium italic">No orders found yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Syncing Indicator */}
      {isSyncing && (
        <div className="absolute top-4 right-8 z-20 flex items-center gap-2 bg-[#181411] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Syncing Orders...
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f2ede8] bg-[#f8f7f5]/50 text-[10px] font-black uppercase tracking-widest text-[#8a7560]">
                <th className="px-8 py-6 text-black">Order ID</th>
                <th className="px-6 py-6 text-black">Customer</th>
                <th className="px-6 py-6 text-black">Status</th>
                <th className="px-6 py-6 text-black">Date</th>
                <th className="px-6 py-6 text-black">Total</th>
                <th className="px-8 py-6 text-right text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2ede8]">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
