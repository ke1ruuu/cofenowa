"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/components/menu/MenuData";
import { MenuCard } from "@/components/menu/MenuCard";
import { CustomizationModal } from "@/components/menu/CustomizationModal";
import { createClient } from "@/utils/supabase/client";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export default function MenuPage() {
  const { addToCart } = useCart();
  const { operationalStatus, isLoading: isStoreLoading } = useStoreSettings();
  const supabase = createClient();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          `
                    *,
                    categories(id, name),
                    product_variants(
                        *,
                        variant_addons(
                            product_addons(*)
                        )
                    )
                `,
        )
        .eq("is_available", true);

      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredMenu = useMemo(() => {
    const sections: { category: string; items: any[] }[] = [];

    // Get unique categories from products or provided categories
    const availableCategories = Array.from(
      new Set(products.map((p) => p.categories?.name)),
    ).filter(Boolean) as string[];

    const categoriesToProcess =
      activeCategory === "All" ? availableCategories : [activeCategory];

    categoriesToProcess.forEach((cat) => {
      const items = products.filter(
        (item) =>
          item.categories?.name === cat &&
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      if (items.length > 0) {
        sections.push({ category: cat, items });
      }
    });

    return sections;
  }, [activeCategory, searchQuery, products]);

  const handleAddToCart = (customization: any) => {
    const orderItem = {
      ...selectedProduct,
      ...customization,
      price: parseFloat(customization.unitPrice), // Use the dynamic unit price
      totalPrice: customization.totalPrice, // Use the pre-calculated total
      size: customization.variantDisplay, // Use the pretty formatted name for the cart
      addonDisplay: customization.addonDisplay,
    };
    addToCart(orderItem);
    setSelectedProduct(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (isStoreLoading) {
    return <div className="min-h-screen bg-[#f8f7f5]" />;
  }

  if (operationalStatus?.is_open === false) {
    return (
      <div className="h-screen w-full bg-[#f8f7f5] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Full-screen Hero for Offline State */}
        {/* Faded Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
          <h1 className="text-[50vh] font-black rotate-12 leading-none">
            CAFE
          </h1>
        </div>

        <div className="container mx-auto max-w-5xl flex flex-col items-center justify-center text-center relative z-10 px-6">
          <div className="relative mb-12 scale-100 md:scale-110">
            <div className="absolute inset-0 bg-[#f27f0d]/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative h-40 w-40 rounded-[2.5rem] bg-white shadow-2xl border border-[#e6e0db] flex items-center justify-center rotate-6">
              <div className="h-28 w-28 rounded-2xl bg-[#f27f0d] flex items-center justify-center text-white scale-90">
                <Loader2 className="h-14 w-14 animate-spin" />
              </div>
            </div>
          </div>

          <div className="max-w-4xl space-y-8">
            <h2 className="text-6xl font-black md:text-8xl tracking-tighter leading-[0.85] text-[#181411]">
              Brewing will <br />
              <span className="text-[#f27f0d]">Resume Soon</span>
            </h2>

            <div className="w-20 h-2 bg-[#f27f0d] mx-auto rounded-full" />

            <p className="text-[#8a7560] font-medium text-lg md:text-2xl leading-relaxed max-w-xl mx-auto">
              Our kitchen is currently closed for a quick refresh. We'll be back
              to serving your favorites in no time!
            </p>

            <div className="pt-6">
              <Button
                variant="outline"
                className="h-16 px-16 rounded-[1.5rem] border-[3px] border-[#181411] font-black uppercase tracking-[0.3em] transition-all hover:bg-[#181411] hover:text-white active:scale-95 text-lg shadow-2xl shadow-[#181411]/10 bg-transparent"
                onClick={() => (window.location.href = "/")}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-12 md:px-10 relative">
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
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-5xl font-black md:text-6xl">
                Our Full <span className="text-[#f27f0d]">Menu</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-[#8a7560]">
                Explore our curated selection of artisanal coffee, hand-crafted
                pastries, and seasonal treats.
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
                className={`flex-shrink-0 rounded-full border-[#e6e0db] font-bold ${
                  activeCategory === cat
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
        {filteredMenu.length > 0 ? (
          <div className="space-y-16">
            {filteredMenu.map((section) => (
              <div key={section.category}>
                <h2 className="mb-8 text-2xl font-black uppercase tracking-wider text-[#f27f0d]">
                  {section.category}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={{
                        ...item,
                        price: item.base_price, // map base_price to price for compatibility
                        image: item.image_url, // map image_url to image for compatibility
                      }}
                      onCustomize={setSelectedProduct}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-[#8a7560]">
              No items found in this category.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="text-[#f27f0d] font-black underline decoration-2 underline-offset-4 mt-2"
            >
              Reset filters
            </Button>
          </div>
        ) : null}
      </main>

      {/* Customization Modal */}
      {selectedProduct && (
        <CustomizationModal
          product={{
            ...selectedProduct,
            price: selectedProduct.base_price, // map base_price to price for compatibility
            image: selectedProduct.image_url, // map image_url to image for compatibility
          }}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />
    </div>
  );
}
