"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const menuItems = [
    {
        name: "Double Espresso",
        price: "$3.50",
        description:
            "Rich, bold, and concentrated. The heart of every cup we brew.",
        image: "/images/coffee1.jpg",
        category: "coffee"
    },
    {
        name: "Butter Croissant",
        price: "$3.75",
        description:
            "Flaky, golden-brown layers of pure French butter goodness.",
        image: "/images/pastries1.jpg",
        category: "pastries"
    },
    {
        name: "Signature Iced Duo",
        price: "$10.50",
        description:
            "Our famous iced latte paired with a decadent chocolate frappe.",
        image: "/images/image4.jpg",
        category: "coffee"
    },
]

export default function Menu() {
    const [activeTab, setActiveTab] = useState("coffee")

    const filteredItems = menuItems.filter(item => item.category === activeTab)

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
                    <div className="flex rounded-xl bg-[#f2ede8] p-1">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab("coffee")}
                            className={`rounded-lg transition-all ${activeTab === "coffee" ? "bg-white shadow-sm" : "text-[#8a7560] hover:text-[#181411]"}`}
                        >
                            Coffee
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab("pastries")}
                            className={`rounded-lg transition-all ${activeTab === "pastries" ? "bg-white shadow-sm" : "text-[#8a7560] hover:text-[#181411]"}`}
                        >
                            Pastries
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className="group overflow-hidden rounded-xl border border-[#e6e0db] bg-white transition-all hover:shadow-xl"
                        >
                            <div
                                className="aspect-square bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${item.image}')` }}
                            />
                            <div className="p-6">
                                <div className="mb-2 flex items-start justify-between">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <span className="font-bold text-[#f27f0d]">
                                        {item.price}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-[#8a7560]">
                                    {item.description}
                                </p>
                                <Button
                                    variant="ghost"
                                    className="mt-4 gap-2 p-0 text-[#f27f0d] hover:gap-3 hover:bg-transparent"
                                >
                                    Add to Order <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
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
