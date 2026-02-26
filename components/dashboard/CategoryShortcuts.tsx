"use client"

import { Coffee } from "lucide-react"
import Link from "next/link"

export function CategoryShortcuts() {
    const categories = ["Hot Coffee", "Iced Coffee", "Pastries", "Merchandise"]
    
    return (
        <section className="bg-[#f27f0d]/5 rounded-[2.5rem] p-10 border border-[#f27f0d]/10">
            <h2 className="text-2xl font-black mb-6">Explore the Brew</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {categories.map((cat) => (
                     <Link key={cat} href={`/menu?category=${cat}`} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-[#e6e0db] shadow-sm hover:shadow-md hover:border-[#f27f0d] transition-all group">
                         <div className="h-12 w-12 rounded-full bg-[#f8f7f5] flex items-center justify-center mb-4 group-hover:bg-[#f27f0d]/10 transition-colors">
                             <Coffee className="h-6 w-6 text-[#f27f0d]" />
                         </div>
                         <span className="text-sm font-black text-center">{cat}</span>
                     </Link>
                 ))}
            </div>
        </section>
    )
}
