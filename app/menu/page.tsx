"use client"

import { Button } from "@/components/ui/button"
import { Coffee, ArrowLeft, Search, X, Check, Plus, Minus, ShoppingBag } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { useCart } from "@/context/CartContext"

const CATEGORIES = ["All", "Hot Coffee", "Iced Coffee", "Pastries"]

const MENU_DATA = [
    {
        category: "Hot Coffee",
        items: [
            { id: "i1", name: "Iced Spanish Latte", price: 5.50, description: "Chilled signature latte with a smooth, sweet finish.", image: "/images/coffee4.jpg" },
            { id: "i2", name: "Cold Brew Tonic", price: 6.00, description: "12-hour steep cold brew topped with premium tonic and citrus.", image: "/images/coffee5.jpg" },
        ]
    },
    {
        category: "Iced Coffee",
        items: [
            { id: "h1", name: "Double Espresso", price: 3.50, description: "Rich, bold, and concentrated espresso shot.", image: "/images/coffee1.jpg" },
            { id: "h2", name: "Flat White", price: 4.50, description: "Velvety steamed milk poured over a double shot of espresso.", image: "/images/coffee2.jpg" },
            { id: "h3", name: "Spanish Latte", price: 5.00, description: "Our signature espresso with condensed milk for a creamy sweetness.", image: "/images/coffee3.jpg" },
        ]
    },
    {
        category: "Pastries",
        items: [
            { id: "p1", name: "Butter Croissant", price: 3.75, description: "Flaky, golden-brown layers of pure French butter goodness.", image: "/images/pastries1.jpg" },
            { id: "p2", name: "Pain au Chocolat", price: 4.25, description: "Buttery pastry filled with rich dark chocolate batons.", image: "/images/pastries2.jpg" },
            { id: "p3", name: "Almond Danishes", price: 4.50, description: "Sweet almond cream filled pastry topped with toasted flakes.", image: "/images/pastries3.jpg" },
            { id: "p4", name: "Blueberry Muffin", price: 3.50, description: "Moist muffin packed with fresh blueberries and a crumble top.", image: "/images/pastries4.jpg" },
            { id: "p5", name: "Cinnamon Roll", price: 4.00, description: "Soft dough swirled with cinnamon sugar and vanilla glaze.", image: "/images/pastries5.jpg" },
        ]
    }
]

export default function MenuPage() {
    const { addToCart } = useCart()
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    // Customization state
    const [customization, setCustomization] = useState({
        size: "Medium",
        milk: "Whole Milk",
        sweetness: "Regular",
        quantity: 1
    })

    const filteredMenu = useMemo(() => {
        return MENU_DATA.map(section => ({
            ...section,
            items: section.items.filter(item =>
                (activeCategory === "All" || section.category === activeCategory) &&
                (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        })).filter(section => section.items.length > 0)
    }, [activeCategory, searchQuery])

    const handleOpenCustomization = (product: any) => {
        setSelectedProduct(product)
        setCustomization({
            size: "Medium",
            milk: "Whole Milk",
            sweetness: "Regular",
            quantity: 1
        })
    }

    const handleAddToCart = () => {
        const orderItem = {
            ...selectedProduct,
            ...customization,
            totalPrice: (selectedProduct.price * customization.quantity).toFixed(2)
        }
        addToCart(orderItem)
        setSelectedProduct(null)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
            <Header />

            <main className="container mx-auto max-w-7xl px-4 py-12 md:px-10">
                {/* Success Toast */}
                {showSuccess && (
                    <div className="fixed bottom-10 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#181411] px-6 py-4 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f27f0d]">
                            <Check className="h-4 w-4" />
                        </div>
                        <span className="font-bold">Added to your order!</span>
                    </div>
                )}

                {/* Breadcrumbs & Title */}
                <div className="mb-12">
                    <Link href="/" className="mb-6 flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-5xl font-black md:text-6xl">Our Full <span className="text-[#f27f0d]">Menu</span></h1>
                            <p className="mt-4 max-w-md text-lg text-[#8a7560]">
                                Explore our curated selection of artisanal coffee, hand-crafted pastries, and seasonal treats.
                            </p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a7560]" />
                            <Input
                                placeholder="Search our brew..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-[#e6e0db] bg-white pl-10 focus-visible:ring-[#f27f0d]"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="sticky top-[4.1rem] z-40 -mx-4 mb-12 flex items-center justify-between overflow-x-auto bg-[#f8f7f5]/80 px-4 py-4 backdrop-blur-md md:mx-0 md:px-0">
                    <div className="flex gap-2">
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat ? "default" : "outline"}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 rounded-full border-[#e6e0db] font-bold ${activeCategory === cat
                                    ? "bg-[#f27f0d] hover:bg-[#f27f0d]/90"
                                    : "bg-white text-[#8a7560] hover:bg-neutral-50 hover:text-[#181411]"
                                    }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="space-y-16">
                    {filteredMenu.map((section) => (
                        <div key={section.category}>
                            <h2 className="mb-8 text-2xl font-black uppercase tracking-wider text-[#f27f0d]">
                                {section.category}
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item) => (
                                    <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6e0db] bg-white transition-all hover:shadow-xl">
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
                                                onClick={() => handleOpenCustomization(item)}
                                                className="mt-6 w-full bg-[#181411] font-bold hover:bg-[#f27f0d]"
                                            >
                                                Customize & Add
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Customization Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f5] text-[#8a7560] transition-colors hover:bg-[#181411] hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="relative h-64 w-full md:h-auto md:w-2/5">
                                <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 p-8 md:p-10">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-black">{selectedProduct.name}</h2>
                                    <p className="mt-2 text-[#8a7560]">{selectedProduct.description}</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Size Selection */}
                                    <div>
                                        <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[#f27f0d]">Select Size</h3>
                                        <div className="flex gap-3">
                                            {["Small", "Medium", "Large"].map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setCustomization({ ...customization, size })}
                                                    className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${customization.size === size
                                                        ? "border-[#f27f0d] bg-[#f27f0d]/5 text-[#f27f0d]"
                                                        : "border-[#f2ede8] bg-white text-[#8a7560] hover:border-[#e6e0db]"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Milk Selection - only for non-pastries */}
                                    {!selectedProduct.id.startsWith('p') && (
                                        <div>
                                            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-[#f27f0d]">Milk Preference</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {["Whole Milk", "Oat Milk", "Almond Milk", "No Milk"].map(milk => (
                                                    <button
                                                        key={milk}
                                                        onClick={() => setCustomization({ ...customization, milk })}
                                                        className={`rounded-full border-2 px-5 py-2 text-xs font-bold transition-all ${customization.milk === milk
                                                            ? "border-[#181411] bg-[#181411] text-white"
                                                            : "border-[#f2ede8] bg-white text-[#8a7560] hover:border-[#e6e0db]"
                                                            }`}
                                                    >
                                                        {milk}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity and Action */}
                                    <div className="flex items-center justify-between border-t border-[#f2ede8] pt-8">
                                        <div className="flex items-center gap-4 rounded-2xl bg-[#f8f7f5] p-2">
                                            <button
                                                onClick={() => setCustomization({ ...customization, quantity: Math.max(1, customization.quantity - 1) })}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-black">{customization.quantity}</span>
                                            <button
                                                onClick={() => setCustomization({ ...customization, quantity: customization.quantity + 1 })}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <Button
                                            onClick={handleAddToCart}
                                            className="h-14 flex-1 rounded-2xl bg-[#f27f0d] px-8 text-lg font-bold hover:bg-[#f27f0d]/90 md:ml-6"
                                        >
                                            Add to Order • ${(selectedProduct.price * customization.quantity).toFixed(2)}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
