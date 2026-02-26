"use client"

import { useState } from "react"
import { ShoppingBag, Clock, DollarSign, ChevronRight, Loader2 } from "lucide-react"
import { updateOrderStatus } from "@/app/admin/actions"
import Link from "next/link"

interface OrderRowProps {
    order: any
}

export function OrderRow({ order }: OrderRowProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true)
        try {
            await updateOrderStatus(order.id, newStatus)
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status")
        } finally {
            setIsUpdating(false)
        }
    }


    return (
        <tr className="hover:bg-[#f8f7f5] transition-colors group">
            <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#f27f0d]/10 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-[#f27f0d]" />
                    </div>
                    <span className="font-bold">#ORD-{order.id.slice(0, 8)}</span>
                </div>
            </td>
            <td className="px-6 py-6">
                <div className="flex flex-col">
                    <span className="font-bold text-[#181411]">{order.profiles?.full_name || "Guest"}</span>
                    <span className="text-xs text-[#8a7560]">{order.profiles?.email}</span>
                </div>
            </td>
            <td className="px-6 py-6">
                <div className="relative flex items-center gap-2">
                    <select 
                        defaultValue={order.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none transition-all ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'ready' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                        }`}
                    >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-[#8a7560]" />}
                </div>
            </td>
            <td className="px-6 py-6 text-sm text-[#8a7560] font-medium">
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.created_at).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-6">
                <div className="flex items-center gap-1 font-black text-[#181411]">
                    <DollarSign className="h-3.5 w-3.5" />
                    {order.total_amount ? parseFloat(order.total_amount.toString()).toFixed(2) : "0.00"}
                </div>
            </td>
            <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end">
                    <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-black uppercase tracking-widest text-[#f27f0d] hover:underline flex items-center gap-1"
                    >
                        Details <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </td>
        </tr>
    )
}
