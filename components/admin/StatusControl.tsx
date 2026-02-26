"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/app/admin/actions"
import { Loader2, CheckCircle2, Clock } from "lucide-react"

interface StatusControlProps {
    orderId: string
    initialStatus: string
}

export function StatusControl({ orderId, initialStatus }: StatusControlProps) {
    const [status, setStatus] = useState(initialStatus)
    const [isUpdating, setIsUpdating] = useState(false)

    const statuses = [
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'preparing', label: 'Preparing', icon: Loader2 },
        { id: 'ready', label: 'Ready', icon: CheckCircle2 },
        { id: 'completed', label: 'Done', icon: CheckCircle2 },
    ]

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return
        setIsUpdating(true)
        try {
            await updateOrderStatus(orderId, newStatus)
            setStatus(newStatus)
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="bg-white rounded-[3rem] border border-[#e6e0db] p-4 md:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {statuses.map((s) => {
                            const isActive = status === s.id
                            const Icon = s.icon
                            
                            return (
                                <button
                                    key={s.id}
                                    disabled={isUpdating}
                                    onClick={() => handleStatusChange(s.id)}
                                    className={`relative flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                                        isActive 
                                            ? `border-[#181411] bg-[#181411] text-white shadow-lg scale-[1.02] z-10` 
                                            : `border-[#f2ede8] bg-[#f8f7f5] text-[#8a7560] hover:border-[#e6e0db] hover:bg-white`
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#f27f0d]' : 'text-[#8a7560]'} ${s.id === 'preparing' && isActive ? 'animate-spin' : ''}`} />
                                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-[#181411]'}`}>
                                        {s.label}
                                    </span>
                                    {isActive && (
                                        <div className="absolute -top-1 -right-1 h-3 w-3">
                                            <div className="h-full w-full rounded-full bg-[#f27f0d] animate-ping" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="h-px lg:h-10 w-full lg:w-px bg-[#e6e0db]" />

                <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange('cancelled')}
                    className={`shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                        status === 'cancelled'
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-transparent text-red-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                    {status === 'cancelled' ? 'Transaction Cancelled' : 'Cancel Order'}
                </button>
            </div>
            
            {isUpdating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
                    <Loader2 className="h-6 w-6 animate-spin text-[#f27f0d]" />
                </div>
            )}
        </div>
    )
}
