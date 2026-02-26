import { createClient } from "@/utils/supabase/server"
import { ShoppingBag } from "lucide-react"
import { OrderRow } from "@/components/admin/OrderRow"

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    
    // Fetch orders with profile information, items, and item addons
    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            profiles(full_name, email),
            order_items(
                *,
                order_item_addons(*)
            )
        `)
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-[#181411]">Order Management</h1>
                <p className="text-[#8a7560] font-medium mt-2">Track and manage customer orders in real-time.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#f2ede8] bg-[#f8f7f5]/50 text-[10px] font-black uppercase tracking-widest text-[#8a7560]">
                                <th className="px-8 py-6">Order ID</th>
                                <th className="px-6 py-6">Customer</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Date</th>
                                <th className="px-6 py-6">Total</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ede8]">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <OrderRow key={order.id} order={order} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-[#8a7560]">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 rounded-full bg-[#f8f7f5] flex items-center justify-center">
                                                <ShoppingBag className="h-10 w-10 text-[#8a7560]/20" />
                                            </div>
                                            <p className="font-medium italic">No orders yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
