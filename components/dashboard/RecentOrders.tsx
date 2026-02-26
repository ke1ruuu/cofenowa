"use client"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Order {
    id: string
    date: string
    status: string
    total: string
    items: string
}

interface RecentOrdersProps {
    orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
    return (
        <section className="rounded-[2.5rem] border border-[#e6e0db] bg-white p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-[#f27f0d]/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#f27f0d]" />
                </div>
                <h2 className="text-xl font-black">Recent Orders</h2>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="group relative flex flex-col space-y-3 pb-6 border-b border-[#f2ede8] last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{order.id}</p>
                                <p className="text-xs text-[#8a7560] font-medium">{order.date}</p>
                            </div>
                            <span className="text-sm font-black text-[#f27f0d]">{order.total}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-[#8a7560]">{order.items}</span>
                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">{order.status}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <Button variant="outline" className="w-full mt-8 h-12 rounded-xl border-[#e6e0db] font-bold text-sm text-[#8a7560] hover:text-[#181411]" asChild>
                <Link href="/orders">View Order History</Link>
            </Button>
        </section>
    )
}
