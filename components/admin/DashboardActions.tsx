import Link from "next/link";
import {
  Plus,
  ShoppingBag,
  Settings,
  Users,
  BarChart3,
  Coffee,
} from "lucide-react";

export function DashboardActions() {
  const actions = [
    {
      href: "/admin/products/new",
      label: "Product",
      icon: Plus,
      color: "bg-blue-500",
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      color: "bg-[#f27f0d]",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      color: "bg-gray-600",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mini Admin Tip - More Compact */}
      <div className="bg-[#181411] p-6 rounded-[2rem] text-white overflow-hidden relative group">
        <div className="absolute -right-4 -top-4 h-24 w-24 bg-[#f27f0d]/10 rounded-full blur-xl group-hover:bg-[#f27f0d]/30 transition-all duration-700" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
            <Coffee className="h-5 w-5 text-[#f27f0d]" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-1">
              Inventory Tip
            </h3>
            <p className="text-white/50 text-[11px] leading-relaxed font-medium">
              Keep availability updated to ensure customers don&apos;t order
              out-of-stock items.
            </p>
          </div>
        </div>
      </div>

      {/* Compact Quick Actions */}
      <div className="bg-white p-6 rounded-[2rem] border border-[#e6e0db] shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#8a7560] mb-6 px-2">
          Quick Commands
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${action.color}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8a7560] group-hover:text-[#181411] transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/admin/reports" className="block">
        <div className="bg-[#f27f0d]/5 p-6 rounded-[2rem] border border-[#f27f0d]/10 flex items-center justify-between group cursor-pointer hover:bg-[#f27f0d]/10 transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-[#f27f0d]" />
            <span className="text-sm font-black text-[#181411]">
              Sales Reports
            </span>
          </div>
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-[#f27f0d]/20 group-hover:translate-x-1 transition-transform">
            <Plus className="h-4 w-4 text-[#f27f0d] rotate-45" />
          </div>
        </div>
      </Link>
    </div>
  );
}
