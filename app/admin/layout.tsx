import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
    LayoutDashboard, 
    Coffee, 
    ShoppingBag, 
    Users, 
    Settings, 
    LogOut,
    Menu as MenuIcon,
    ChevronLeft,
    MessageSquare
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/login/actions"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

    if (profile?.role?.toLowerCase() !== "admin") {
        redirect("/home")
    }

    const navLinks = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: Coffee },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Feedbacks", href: "/admin/feedbacks", icon: MessageSquare },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-[#f8f7f5]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-full w-64 border-r border-[#e6e0db] bg-white transition-transform lg:translate-x-0 hidden lg:block">
                <div className="flex h-full flex-col p-6">
                    <Link href="/admin" className="flex items-center gap-3 mb-10 group">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#f27f0d] p-1.5 transition-transform group-hover:rotate-6">
                            <Image
                                src="/images/cofenowa/android-chrome-192x192.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="h-full w-full invert"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black leading-none tracking-tight">
                                NOWA ADMIN
                            </h1>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#f27f0d]">Control Panel</span>
                        </div>
                    </Link>

                    <nav className="flex-1 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#8a7560] transition-all hover:bg-[#f8f7f5] hover:text-[#181411]"
                            >
                                <link.icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-[#f2ede8] pt-6">
                        <Link href="/home" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#8a7560] transition-all hover:bg-[#f8f7f5]">
                            <ChevronLeft className="h-5 w-5" />
                            To Store Dashboard
                        </Link>
                        <form action={signOut}>
                            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e6e0db] bg-white px-4 lg:hidden">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[#f27f0d] p-1">
                        <Image
                            src="/images/cofenowa/android-chrome-192x192.png"
                            alt="Logo"
                            width={24}
                            height={24}
                            className="h-full w-full invert"
                        />
                    </div>
                </Link>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#f8f7f5]">
                    <MenuIcon className="h-5 w-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 lg:pl-64 pt-16 lg:pt-0">
                <div className="p-4 md:p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
