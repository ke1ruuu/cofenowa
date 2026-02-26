"use client"

import { ChevronRight, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface Product {
    id: string
    name: string
    price: number
    image: string
    category: string
}

interface RecommendedGridProps {
    products: Product[]
}

export function RecommendedGrid({ products }: RecommendedGridProps) {
    return (
        <section>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black">Specials for You</h2>
                    <p className="text-[#8a7560] font-medium">Hand-picked selections based on your favorites</p>
                </div>
                <Link href="/menu" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#f27f0d] hover:underline">
                    View Menu <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group relative flex flex-col rounded-3xl border border-[#e6e0db] bg-white p-4 transition-all hover:shadow-2xl hover:border-[#f27f0d]/30">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl mb-4">
                            <Image 
                                src={product.image} 
                                alt={product.name} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[#8a7560] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500">
                                <Heart className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d] mb-1">{product.category}</p>
                            <h3 className="text-lg font-bold mb-4">{product.name}</h3>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xl font-black">${product.price.toFixed(2)}</span>
                                <Button className="h-10 w-10 rounded-xl bg-[#181411] p-0 hover:bg-[#f27f0d]">
                                    <ShoppingBag className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
