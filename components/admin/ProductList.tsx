"use client"

import { useState } from "react"
import { Search, Edit2, Trash2, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { deleteProduct } from "../../app/admin/actions"
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ProductList({ initialProducts }: { initialProducts: any[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [products, setProducts] = useState(initialProducts)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async () => {
        if (!deletingProductId) return
        
        setIsDeleting(true)
        const result = await deleteProduct(deletingProductId)
        setIsDeleting(false)
        
        if (result.success) {
            setProducts(products.filter(p => p.id !== deletingProductId))
            setDeletingProductId(null)
        } else {
            alert(result.error || "Failed to delete product")
        }
    }

    return (
        <div className="space-y-8">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8a7560]" />
                    <input 
                        type="text" 
                        placeholder="Search products by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-[#e6e0db] bg-white text-sm focus:ring-2 focus:ring-[#f27f0d] focus:border-[#f27f0d] outline-none transition-all"
                    />
                </div>
                <Button variant="outline" className="h-14 rounded-2xl border-[#e6e0db] bg-white px-6 font-bold text-[#8a7560]">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                </Button>
            </div>

            {/* Product Table / Grid */}
            <div className="bg-white rounded-[2.5rem] border border-[#e6e0db] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#f2ede8] bg-[#f8f7f5]/50 text-[10px] font-black uppercase tracking-widest text-[#8a7560]">
                                <th className="px-8 py-6">Product</th>
                                <th className="px-6 py-6 font-serif">Category</th>
                                <th className="px-6 py-6">Base Price</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f2ede8]">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-[#f8f7f5] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#e6e0db] bg-[#f8f7f5]">
                                                    {product.image_url ? (
                                                        <Image 
                                                            src={product.image_url} 
                                                            alt={product.name} 
                                                            fill 
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full">
                                                            <Plus className="h-6 w-6 text-[#8a7560]/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#181411]">{product.name}</p>
                                                    <p className="text-xs text-[#8a7560] font-medium line-clamp-1 max-w-[200px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-[#8a7560]">
                                            {product.categories?.name}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-black">
                                            ${product.base_price ? parseFloat(product.base_price.toString()).toFixed(2) : "0.00"}
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                                product.is_available 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {product.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/edit/${product.id}`}>
                                                    <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-[#e6e0db] hover:border-[#f27f0d] hover:text-[#f27f0d]">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            onClick={() => setDeletingProductId(product.id)}
                                                            variant="outline" 
                                                            className="h-10 w-10 p-0 rounded-xl border-[#e6e0db] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[2.5rem] border-[#e6e0db] p-8">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black">Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-[#8a7560] font-medium text-base">
                                                                This will permanently delete <span className="font-bold text-[#181411]">"{product.name}"</span>. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-8 gap-3">
                                                            <AlertDialogCancel className="rounded-xl border-[#e6e0db] font-bold h-12">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={handleDelete}
                                                                disabled={isDeleting}
                                                                className="rounded-xl bg-red-500 hover:bg-red-600 font-bold h-12 text-white"
                                                            >
                                                                {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-[#8a7560]">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-20 w-20 rounded-full bg-[#f8f7f5] flex items-center justify-center">
                                                <CoffeeIcon className="h-10 w-10 text-[#8a7560]/20" />
                                            </div>
                                            <p className="font-medium italic">No products found. Start by adding one!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function CoffeeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  )
}
