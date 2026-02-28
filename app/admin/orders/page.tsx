import { createClient } from "@/utils/supabase/server";
import { RealtimeOrderList } from "@/components/admin/RealtimeOrderList";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // Initial fetch for PSR (Server-side rendering)
  const { data: initialOrders } = await supabase
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

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e6e0db]">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#181411]">
            Order Management
          </h1>
          <p className="text-[#8a7560] font-medium mt-2">
            Track and manage customer orders in real-time.
          </p>
        </div>
      </div>

      <RealtimeOrderList initialOrders={initialOrders || []} />
    </div>
  );
}
