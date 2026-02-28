import { Clock } from "lucide-react";
import Link from "next/link";

interface RecentOrdersProps {
  orders: any[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm">
      <div className="p-8 border-b border-[#f2ede8] flex items-center justify-between">
        <h2 className="text-xl font-black flex items-center gap-3">
          <Clock className="h-5 w-5 text-[#f27f0d]" />
          Recent Orders
        </h2>
        <Link
          href="/admin/orders"
          className="cursor-pointer text-xs font-black uppercase tracking-widest text-[#f27f0d] hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="p-0">
        {orders && orders.length > 0 ? (
          <div className="divide-y divide-[#f2ede8]">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 flex items-center justify-between hover:bg-[#f8f7f5] transition-colors"
              >
                <div>
                  <p className="font-bold text-sm">
                    #ORD-{order.id.slice(0, 4)}
                  </p>
                  <p className="text-xs text-[#8a7560] font-medium">
                    {order.profiles?.full_name || "Guest"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm">
                    $
                    {order.total_amount
                      ? parseFloat(order.total_amount.toString()).toFixed(2)
                      : "0.00"}
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d] bg-[#f27f0d]/10 px-2 py-0.5 rounded">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#8a7560]">
            <p className="font-medium italic">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
