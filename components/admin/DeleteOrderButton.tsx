"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteOrder } from "@/app/admin/actions"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"

interface DeleteOrderButtonProps {
    orderId: string
}

export function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteOrder(orderId)
            if (result.success) {
                router.push("/admin/orders")
            } else {
                alert(result.error || "Failed to delete order")
            }
        } catch (error) {
            console.error("Failed to delete order:", error)
            alert("An unexpected error occurred")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-full h-14 rounded-[2rem] border-[#e6e0db] text-[#8a7560] hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px]"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Erase Transaction Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] bg-white border-[#e6e0db] p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black tracking-tight">Permanent Removal</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#8a7560] font-medium py-2">
                        Are you sure you want to erase order #ORD-{orderId.slice(0, 8).toUpperCase()}? This action will permanently remove all associated item history and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel className="rounded-xl border-[#e6e0db] font-bold h-12">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleDelete}
                        className="rounded-xl bg-red-500 hover:bg-red-600 font-bold h-12 text-white border-none shadow-lg shadow-red-500/20"
                    >
                        Yes, Delete Permanently
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
