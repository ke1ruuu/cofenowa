import { X, Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useMemo } from "react"

interface CustomizationModalProps {
    product: any
    onClose: () => void
    onAddToCart: (customization: any) => void
}

export function CustomizationModal({ product, onClose, onAddToCart }: CustomizationModalProps) {
    const variants = product.product_variants || []
    
    // Extract unique addons from all variants
    const uniqueAddons = useMemo(() => {
        const addonsMap = new Map()
        variants.forEach((v: any) => {
            v.variant_addons?.forEach((va: any) => {
                const addon = va.product_addons
                if (addon && !addonsMap.has(addon.id)) {
                    addonsMap.set(addon.id, addon)
                }
            })
        })
        return Array.from(addonsMap.values())
    }, [variants])

    const [customization, setCustomization] = useState({
        selectedVariantId: variants[0]?.id || null,
        selectedAddonIds: [] as string[],
        quantity: 1
    })

    const selectedVariant = useMemo(() => 
        variants.find((v: any) => v.id === customization.selectedVariantId),
        [variants, customization.selectedVariantId]
    )

    const unitPrice = useMemo(() => {
        let price = parseFloat(product.price || 0)
        
        // Add variant modifier
        if (selectedVariant) {
            price += parseFloat(selectedVariant.price_modifier || 0)
        }
        
        // Add selected addons
        customization.selectedAddonIds.forEach(id => {
            const addon = uniqueAddons.find(a => a.id === id)
            if (addon) {
                price += parseFloat(addon.price || 0)
            }
        })
        
        return price
    }, [product.price, selectedVariant, customization.selectedAddonIds, uniqueAddons])

    const totalPrice = (unitPrice * customization.quantity).toFixed(2)

    const toggleAddon = (addonId: string) => {
        setCustomization(prev => ({
            ...prev,
            selectedAddonIds: prev.selectedAddonIds.includes(addonId)
                ? prev.selectedAddonIds.filter(id => id !== addonId)
                : [...prev.selectedAddonIds, addonId]
        }))
    }

    const handleAddToCart = () => {
        const addons = customization.selectedAddonIds.map(id => {
            const addon = uniqueAddons.find(a => a.id === id)
            return {
                name: addon?.name,
                price: parseFloat(addon?.price || 0)
            }
        })

        onAddToCart({
            ...customization,
            unitPrice: unitPrice.toFixed(2),
            totalPrice: totalPrice,
            addons,
            // Format variants/modifiers for display in cart
            variantDisplay: selectedVariant?.name || "Standard",
            addonDisplay: addons.map(a => a.name).join(', ')
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f5] text-[#8a7560] transition-colors hover:bg-[#181411] hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
                    <div className="relative h-48 w-full md:h-auto md:w-5/12 text-black">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8 md:hidden">
                             <h2 className="text-2xl font-black text-white">{product.name}</h2>
                        </div>
                    </div>

                    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                        <div className="mb-8 hidden md:block">
                            <h2 className="text-4xl font-black tracking-tight">{product.name}</h2>
                            <p className="mt-3 text-[#8a7560] font-medium leading-relaxed">{product.description}</p>
                        </div>

                        <div className="space-y-10">
                            {/* Size/Variant Selection */}
                            {variants.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f27f0d]">Options & Sizes</h3>
                                        <span className="text-[10px] font-bold text-[#8a7560] bg-[#f8f7f5] px-2 py-1 rounded">Required</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {variants.map((v: any) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setCustomization({ ...customization, selectedVariantId: v.id })}
                                                className={`min-w-[120px] px-6 rounded-2xl border-2 py-4 text-sm font-black transition-all ${customization.selectedVariantId === v.id
                                                    ? "border-[#f27f0d] bg-[#f27f0d]/5 text-[#f27f0d] shadow-sm"
                                                    : "border-[#f2ede8] bg-white text-[#8a7560] hover:border-[#181411] hover:text-[#181411]"
                                                    }`}
                                            >
                                                {v.name}
                                                <span className="block text-[10px] opacity-60 mt-0.5">
                                                    {v.price_modifier >= 0 ? '+' : ''}
                                                    ${parseFloat(v.price_modifier || 0).toFixed(2)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Addons Selection */}
                            {uniqueAddons.length > 0 && (
                                <section>
                                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#f27f0d]">Extra Perks & Addons</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {uniqueAddons.map((addon: any) => (
                                            <button
                                                key={addon.id}
                                                onClick={() => toggleAddon(addon.id)}
                                                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-xs font-black transition-all ${customization.selectedAddonIds.includes(addon.id)
                                                    ? "border-[#181411] bg-[#181411] text-white"
                                                    : "border-[#f2ede8] bg-white text-[#8a7560] hover:border-[#e6e0db]"
                                                    }`}
                                            >
                                                <div className="flex flex-col text-left">
                                                    {addon.name}
                                                    <span className="text-[9px] opacity-60 font-bold">+${parseFloat(addon.price || 0).toFixed(2)}</span>
                                                </div>
                                                {customization.selectedAddonIds.includes(addon.id) && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Quantity and Action */}
                            <div className="sticky bottom-0 bg-white pt-6 pb-2 mt-12 border-t border-[#f2ede8] flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4 rounded-2xl bg-[#f8f7f5] p-1.5 border border-[#e6e0db]">
                                    <button
                                        onClick={() => setCustomization({ ...customization, quantity: Math.max(1, customization.quantity - 1) })}
                                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-transform hover:scale-110 active:scale-95 border border-[#e6e0db]"
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="w-10 text-center text-lg font-black">{customization.quantity}</span>
                                    <button
                                        onClick={() => setCustomization({ ...customization, quantity: customization.quantity + 1 })}
                                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-transform hover:scale-110 active:scale-95 border border-[#e6e0db]"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    className="h-14 flex-1 rounded-2xl bg-[#181411] px-8 text-lg font-black hover:bg-black shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
                                >
                                    Add to Order • ${totalPrice}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
