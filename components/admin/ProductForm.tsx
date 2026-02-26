"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
    ArrowLeft, 
    Save, 
    Image as ImageIcon,
    Loader2,
    X,
    UploadCloud,
    Plus
} from "lucide-react"
import Link from "next/link"
import { createProduct, updateProduct } from "@/app/admin/actions"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"

interface Variant {
    name: string
    price_modifier: number
}

interface Addon {
    name: string
    price: number
}

interface ProductFormProps {
    initialData?: any
    id?: string
    categories: { id: string, name: string }[]
}

export function ProductForm({ initialData, id, categories }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
    const [variants, setVariants] = useState<Variant[]>(initialData?.variants || [])
    const [addons, setAddons] = useState<Addon[]>(initialData?.addons || [])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [globalVariants, setGlobalVariants] = useState<string[]>([])
    const [globalAddons, setGlobalAddons] = useState<Addon[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchGlobals = async () => {
            const { data: vData } = await supabase.from('product_variants').select('name')
            if (vData) setGlobalVariants(Array.from(new Set(vData.map(v => v.name))))

            const { data: aData } = await supabase.from('product_addons').select('name, price')
            if (aData) {
                // Deduplicate by name for suggestions
                const uniqueAddons: Addon[] = []
                const names = new Set()
                aData.forEach(a => {
                    if (!names.has(a.name.toLowerCase())) {
                        names.add(a.name.toLowerCase())
                        uniqueAddons.push(a)
                    }
                })
                setGlobalAddons(uniqueAddons)
            }
        }
        fetchGlobals()
    }, [supabase])

    const isEdit = !!id

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await uploadFile(file)
        }
    }

    const uploadFile = async (file: File) => {
        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `product-thumbnails/${fileName}`

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file)

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)

            setPreviewUrl(publicUrl)
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Failed to upload image. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            await uploadFile(file)
        }
    }

    const clearImage = () => {
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const [message, setMessage] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // Dialog state
    const [showVariantDialog, setShowVariantDialog] = useState(false)
    const [showAddonDialog, setShowAddonDialog] = useState(false)
    const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null)
    const [editingAddonIndex, setEditingAddonIndex] = useState<number | null>(null)
    const [tempVariant, setTempVariant] = useState<Variant>({ name: "", price_modifier: 0 })
    const [tempAddon, setTempAddon] = useState<Addon>({ name: "", price: 0 })
    
    // Multi-selection state for global suggestions
    const [selectedGlobalNames, setSelectedGlobalNames] = useState<string[]>([])
    const [selectedGlobalAddons, setSelectedGlobalAddons] = useState<Addon[]>([])

    const openVariantDialog = (index: number | null = null) => {
        setSelectedGlobalNames([])
        if (index !== null) {
            setEditingVariantIndex(index)
            setTempVariant({ ...variants[index] })
        } else {
            setEditingVariantIndex(null)
            setTempVariant({ name: "", price_modifier: 0 })
        }
        setShowVariantDialog(true)
    }

    const openAddonDialog = (index: number | null = null) => {
        setSelectedGlobalAddons([])
        if (index !== null) {
            setEditingAddonIndex(index)
            setTempAddon({ ...addons[index] })
        } else {
            setEditingAddonIndex(null)
            setTempAddon({ name: "", price: 0 })
        }
        setShowAddonDialog(true)
    }

    const saveVariant = () => {
        if (!tempVariant.name) return
        
        const nameLower = tempVariant.name.toLowerCase()
        const isDuplicate = variants.some((v, idx) => 
            v.name.toLowerCase() === nameLower && idx !== editingVariantIndex
        )

        if (isDuplicate) {
            alert(`"${tempVariant.name}" is already a variant for this product.`)
            return
        }

        if (editingVariantIndex !== null) {
            const newVariants = [...variants]
            newVariants[editingVariantIndex] = tempVariant
            setVariants(newVariants)
        } else {
            setVariants([...variants, tempVariant])
        }
        setShowVariantDialog(false)
    }

    const saveAddon = () => {
        if (!tempAddon.name) return

        const nameLower = tempAddon.name.toLowerCase()
        const isDuplicate = addons.some((a, idx) => 
            a.name.toLowerCase() === nameLower && idx !== editingAddonIndex
        )

        if (isDuplicate) {
            alert(`"${tempAddon.name}" is already an addon for this product.`)
            return
        }

        if (editingAddonIndex !== null) {
            const newAddons = [...addons]
            newAddons[editingAddonIndex] = tempAddon
            setAddons(newAddons)
        } else {
            setAddons([...addons, tempAddon])
        }
        setShowAddonDialog(false)
    }

    const addSelectedGlobalVariants = () => {
        const newVariants = selectedGlobalNames.map(name => ({
            name,
            price_modifier: 0
        }))
        setVariants([...variants, ...newVariants])
        setShowVariantDialog(false)
    }

    const addSelectedGlobalAddons = () => {
        setAddons([...addons, ...selectedGlobalAddons])
        setShowAddonDialog(false)
    }

    return (
        <>
            <form action={async (formData) => {
                setIsLoading(true)
                setMessage(null)
                setIsSuccess(false)
                try {
                    if (previewUrl) {
                        formData.set("image_url", previewUrl)
                    }
                    
                    let result;
                    if (isEdit) {
                        result = await updateProduct(id!, formData)
                    } else {
                        result = await createProduct(formData)
                    }

                    if (result?.error) {
                        setMessage(result.error)
                        setIsSuccess(false)
                    } else {
                        setMessage(isEdit ? "Product updated successfully!" : "Product created successfully!")
                        setIsSuccess(true)
                    }
                } catch (error: any) {
                    setMessage(error.message || "An unexpected error occurred")
                    setIsSuccess(false)
                } finally {
                    setIsLoading(false)
                }
            }} className="space-y-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <Link href="/admin/products" className="flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Products
                        </Link>
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isLoading || isUploading}
                        className="h-14 bg-[#181411] hover:bg-[#181411]/90 rounded-2xl px-8 font-bold text-lg shadow-lg group"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                        {isEdit ? "Update Product" : "Save Product"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
                    {/* Left Column: Image and Status */}
                    <div className="space-y-8 h-full flex flex-col">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#f27f0d] mb-6">Product Visual</h3>
                            
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                                    isDragging 
                                        ? 'border-[#f27f0d] bg-[#f27f0d]/5' 
                                        : 'border-[#e6e0db] bg-[#f8f7f5] hover:border-[#f27f0d]/50 group'
                                }`}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-10 w-10 text-[#f27f0d] animate-spin" />
                                        <p className="text-sm font-bold text-[#8a7560]">Brewing image...</p>
                                    </div>
                                ) : previewUrl ? (
                                    <>
                                        <Image 
                                            src={previewUrl} 
                                            fill 
                                            className="object-cover" 
                                            alt="Preview" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-2 text-white">
                                                <UploadCloud className="h-8 w-8" />
                                                <p className="text-xs font-black uppercase tracking-widest">Change Image</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearImage()
                                            }}
                                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 p-8 text-center">
                                        <div className="h-20 w-20 rounded-full bg-white border border-[#e6e0db] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <ImageIcon className="h-10 w-10 text-[#f27f0d]" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-[#181411]">Upload Visual</p>
                                            <p className="text-xs font-medium text-[#8a7560] mt-1">Click or drag and drop<br/>PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            
                            {/* Hidden input for the form data to pick up the image URL */}
                            <input 
                                type="hidden" 
                                name="image_url" 
                                value={previewUrl || ""} 
                            />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-[#e6e0db] shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#f27f0d] mb-6">Status & Availability</h3>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f7f5] border border-[#f2ede8]">
                                <span className="font-bold text-[#181411]">Product Visible</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="is_available" 
                                        className="sr-only peer" 
                                        defaultChecked={initialData?.is_available ?? true} 
                                    />
                                    <div className="w-11 h-6 bg-[#e6e0db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f27f0d]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details (Now containing Basic Info, Variants, and Addons) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-[#e6e0db] h-full flex flex-col shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#f27f0d]">Product Master Data</h3>
                                {message && (
                                    <p className={`text-xs font-bold italic ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-10 flex-1">
                                {/* Basic Info Core */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Product Name</label>
                                        <Input 
                                            name="name" 
                                            required 
                                            defaultValue={initialData?.name}
                                            placeholder="e.g. Signature Spanish Latte" 
                                            className="h-14 rounded-2xl border-[#e6e0db] bg-white text-lg font-bold focus:ring-[#f27f0d]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Description</label>
                                        <Textarea 
                                            name="description" 
                                            defaultValue={initialData?.description}
                                            placeholder="Tell the story of this brew..." 
                                            className="min-h-[100px] rounded-2xl border-[#e6e0db] bg-white focus:ring-[#f27f0d] leading-relaxed"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Category</label>
                                            <select 
                                                name="category_id" 
                                                required
                                                defaultValue={initialData?.category_id}
                                                className="w-full h-14 rounded-2xl border border-[#e6e0db] bg-white px-4 font-bold focus:ring-2 focus:ring-[#f27f0d] outline-none transition-all"
                                            >
                                                <option value="" disabled>Select category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] ml-1">Base Price ($)</label>
                                            <Input 
                                                name="base_price" 
                                                type="number" 
                                                step="0.01" 
                                                required 
                                                defaultValue={initialData?.base_price}
                                                placeholder="0.00" 
                                                className="h-14 rounded-2xl border-[#e6e0db] bg-white text-lg font-black focus:ring-[#f27f0d]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-[#f2ede8]" />

                                {/* Variants Core (Tags Style) */}
                                <section className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Variants (Sizes)</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((v, i) => (
                                            <div key={i} className="group flex items-center gap-2 bg-[#181411] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-[#f27f0d] transition-colors" onClick={() => openVariantDialog(i)}>
                                                <span className="text-xs font-black uppercase tracking-widest">{v.name}</span>
                                                <span className="text-[10px] font-bold opacity-60">${v.price_modifier >= 0 ? '+' : ''}{v.price_modifier.toFixed(2)}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setVariants(variants.filter((_, idx) => idx !== i))
                                                    }}
                                                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={() => openVariantDialog()}
                                            className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-dashed border-[#e6e0db] text-[#8a7560] hover:border-[#f27f0d] hover:text-[#f27f0d] transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </section>

                                <div className="h-px bg-[#f2ede8]" />

                                {/* Addons Core (Tags Style) */}
                                <section className="space-y-6 pb-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Top-ups & Addons</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {addons.map((a, i) => (
                                            <div key={i} className="group flex items-center gap-2 bg-white border-2 border-[#181411] text-[#181411] px-4 py-2 rounded-full cursor-pointer hover:border-[#f27f0d] hover:text-[#f27f0d] transition-all" onClick={() => openAddonDialog(i)}>
                                                <span className="text-xs font-black uppercase tracking-widest">{a.name}</span>
                                                <span className="text-[10px] font-bold opacity-60">${a.price.toFixed(2)}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setAddons(addons.filter((_, idx) => idx !== i))
                                                    }}
                                                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={() => openAddonDialog()}
                                            className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-dashed border-[#e6e0db] text-[#8a7560] hover:border-[#f27f0d] hover:text-[#f27f0d] transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </section>
                            </div>

                            {/* Hidden inputs for JSON data */}
                            <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />
                            <input type="hidden" name="addons_json" value={JSON.stringify(addons)} />
                        </div>
                    </div>
                </div>
            </form>

            {/* Custom Dialogs */}
            {showVariantDialog && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#181411]/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#181411]">{editingVariantIndex !== null ? 'Edit Size' : 'Add Size Variant'}</h3>
                            <button onClick={() => setShowVariantDialog(false)} className="h-10 w-10 rounded-full bg-[#f8f7f5] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Existing Options Suggestion */}
                        {!editingVariantIndex && globalVariants.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Choose from existing</h4>
                                    {selectedGlobalNames.length > 0 && (
                                        <Button 
                                            onClick={addSelectedGlobalVariants}
                                            variant="ghost" 
                                            className="h-auto p-0 text-[#f27f0d] text-[10px] font-black uppercase hover:bg-transparent"
                                        >
                                            Add {selectedGlobalNames.length} Selected
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {globalVariants
                                        .filter(vName => !variants.some(v => v.name.toLowerCase() === vName.toLowerCase()))
                                        .map(vName => (
                                        <button
                                            key={vName}
                                            type="button"
                                            onClick={() => {
                                                if (selectedGlobalNames.includes(vName)) {
                                                    setSelectedGlobalNames(selectedGlobalNames.filter(n => n !== vName))
                                                } else {
                                                    setSelectedGlobalNames([...selectedGlobalNames, vName])
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                                                selectedGlobalNames.includes(vName)
                                                ? "bg-[#f27f0d] border-[#f27f0d] text-white shadow-lg scale-105" 
                                                : "bg-white border-[#f2ede8] text-[#8a7560] hover:border-[#181411]"
                                            }`}
                                        >
                                            {vName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">{editingVariantIndex !== null ? 'Size Name' : 'Create Original'}</label>
                                <Input 
                                    value={tempVariant.name}
                                    onChange={(e) => setTempVariant({ ...tempVariant, name: e.target.value })}
                                    placeholder="e.g. Venti, Large, Hot..."
                                    className="h-14 rounded-2xl border-[#e6e0db] font-bold"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Price Modifier (+/- $)</label>
                                <Input 
                                    type="number"
                                    step="0.01"
                                    value={tempVariant.price_modifier}
                                    onChange={(e) => setTempVariant({ ...tempVariant, price_modifier: parseFloat(e.target.value) || 0 })}
                                    className="h-14 rounded-2xl border-[#e6e0db] font-black"
                                />
                            </div>
                        </div>
                        <Button onClick={saveVariant} className="w-full h-14 bg-[#181411] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            {editingVariantIndex !== null ? 'Update Variant' : 'Create Variant'}
                        </Button>
                    </div>
                </div>
            )}

            {showAddonDialog && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#181411]/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#181411]">{editingAddonIndex !== null ? 'Edit Extra' : 'Add Top-up Extra'}</h3>
                            <button onClick={() => setShowAddonDialog(false)} className="h-10 w-10 rounded-full bg-[#f8f7f5] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Existing Options Suggestion */}
                        {!editingAddonIndex && globalAddons.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Quick Add Existing</h4>
                                    {selectedGlobalAddons.length > 0 && (
                                        <Button 
                                            onClick={addSelectedGlobalAddons}
                                            variant="ghost" 
                                            className="h-auto p-0 text-[#181411] text-[10px] font-black uppercase hover:bg-transparent"
                                        >
                                            Add {selectedGlobalAddons.length} Selected
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {globalAddons
                                        .filter(ga => !addons.some(a => a.name.toLowerCase() === ga.name.toLowerCase()))
                                        .map(ga => (
                                        <button
                                            key={ga.name}
                                            type="button"
                                            onClick={() => {
                                                const isSelected = selectedGlobalAddons.some(s => s.name === ga.name)
                                                if (isSelected) {
                                                    setSelectedGlobalAddons(selectedGlobalAddons.filter(s => s.name !== ga.name))
                                                } else {
                                                    setSelectedGlobalAddons([...selectedGlobalAddons, ga])
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                                                selectedGlobalAddons.some(s => s.name === ga.name)
                                                ? "bg-[#181411] border-[#181411] text-white shadow-lg scale-105" 
                                                : "bg-[#f8f7f5] border-[#f2ede8] text-[#8a7560] hover:border-[#181411]"
                                            }`}
                                        >
                                            <div className="flex flex-col items-start px-1">
                                                <span>{ga.name}</span>
                                                <span className="text-[9px] opacity-60">${parseFloat(ga.price.toString()).toFixed(2)}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">{editingAddonIndex !== null ? 'Extra Name' : 'Create New Extra'}</label>
                                <Input 
                                    value={tempAddon.name}
                                    onChange={(e) => setTempAddon({ ...tempAddon, name: e.target.value })}
                                    placeholder="e.g. Oat Milk, Salted Cream..."
                                    className="h-14 rounded-2xl border-[#e6e0db] font-bold"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8a7560]">Price ($)</label>
                                <Input 
                                    type="number"
                                    step="0.01"
                                    value={tempAddon.price}
                                    onChange={(e) => setTempAddon({ ...tempAddon, price: parseFloat(e.target.value) || 0 })}
                                    className="h-14 rounded-2xl border-[#e6e0db] font-black"
                                />
                            </div>
                        </div>
                        <Button onClick={saveAddon} className="w-full h-14 bg-[#181411] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            {editingAddonIndex !== null ? 'Update Extra' : 'Create Extra'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
