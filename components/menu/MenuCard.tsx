"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MenuCardProps {
    item: {
        id: string
        name: string
        price: number
        description: string
        image: string
    }
    onCustomize: (item: any) => void
}

export function MenuCard({ item, onCustomize }: MenuCardProps) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6e0db] bg-white transition-all hover:shadow-xl">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="rounded-full bg-[#f27f0d]/10 px-3 py-1 text-sm font-black text-[#f27f0d]">
                        ${item.price.toFixed(2)}
                    </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-[#8a7560]">
                    {item.description}
                </p>
                <Button
                    onClick={() => onCustomize(item)}
                    className="mt-6 w-full bg-[#181411] font-bold hover:bg-[#f27f0d]"
                >
                    Customize & Add
                </Button>
            </div>
        </div>
    )
}
