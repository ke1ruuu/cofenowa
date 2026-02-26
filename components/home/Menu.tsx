"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function Menu() {
    const [activeTab, setActiveTab] = useState("Hot Coffee")
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from("products")
                .select("*, categories(name)")
                .eq("is_available", true)
            
            if (!error && data) {
                setProducts(data)
                // Set initial tab to the first available category if Hot Coffee isn't available
                if (data.length > 0) {
                    const categories = Array.from(new Set(data.map(p => p.categories?.name))).filter(Boolean) as string[]
                    if (!categories.includes("Hot Coffee") && categories.length > 0) {
                        setActiveTab(categories[0])
                    }
                }
            }
            setIsLoading(false)
        }
        fetchProducts()
    }, [])

    const categories = Array.from(new Set(products.map(p => p.categories?.name))).filter(Boolean) as string[]
    const filteredItems = products.filter(item => item.categories?.name === activeTab)

    return (
        <section className="px-4 py-16 md:px-10" id="menu">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#f27f0d]">
                            Freshly Brewed
                        </span>
                        <h2 className="mt-2 text-4xl font-black">Our Specialties</h2>
                    </div>
                    <div className="flex rounded-xl bg-[#f2ede8] p-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant="ghost"
                                onClick={() => setActiveTab(cat)}
                                className={`rounded-lg transition-all whitespace-nowrap ${activeTab === cat ? "bg-white shadow-sm" : "text-[#8a7560] hover:text-[#181411]"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-[#f27f0d] animate-spin" />
                        <p className="font-bold text-[#8a7560]">Loading menu...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group overflow-hidden rounded-xl border border-[#e6e0db] bg-white transition-all hover:shadow-xl"
                            >
                                <div
                                    className="aspect-square bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${item.image_url || '/images/coffee1.jpg'}')` }}
                                />
                                <div className="p-6">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="text-xl font-bold">{item.name}</h3>
                                        <span className="font-bold text-[#f27f0d]">
                                            ${item.base_price.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-[#8a7560]">
                                        {item.description}
                                    </p>
                                    <Link href="/menu">
                                        <Button
                                            variant="ghost"
                                            className="mt-4 gap-2 p-0 text-[#f27f0d] hover:gap-3 hover:bg-transparent"
                                        >
                                            Order Now <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl font-bold text-[#8a7560]">Our baristas are preparing new items. Check back soon!</p>
                    </div>
                )}
                
                <div className="mt-16 flex justify-center">
                    <Link href="/menu">
                        <Button size="lg" className="h-14 rounded-full bg-[#181411] px-10 text-lg font-bold transition-all hover:scale-105 hover:bg-[#f27f0d]">
                            View Full Menu <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
