"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Product } from "@/lib/db";

interface Props {
  initialProducts: Product[];
}

export default function UmkmSection({ initialProducts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categories = [
    { value: "semua", label: "Semua Kategori" },
    { value: "dapur", label: "Peralatan Dapur" },
    { value: "dekorasi", label: "Dekorasi Ruang" },
    { value: "fashion", label: "Gaya Hidup & Fashion" },
    { value: "makanan", label: "Makanan Lokal" },
    { value: "minuman", label: "Minuman Lokal" },
  ];

  const filteredProducts =
    activeCategory === "semua"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  return (
    <section id="umkm" className="py-24 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins">
            Etalase Desa
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground tracking-tight">
            UMKM & Kerajinan Unggulan
          </h2>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto leading-relaxed">
            Dukung perekonomian lokal dengan membeli produk anyaman bambu langsung dari tangan pengrajin Desa Salawu.
          </p>
        </div>

        {/* Categories Tab Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 relative z-50">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium font-poppins transition-all cursor-pointer border relative z-50 pointer-events-auto",
                activeCategory === cat.value
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-background rounded-2xl border border-border/50 overflow-hidden shadow-sm flex flex-col group hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              {/* Product Visual Mockup */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/15 flex items-center justify-center overflow-hidden border-b border-border/40">
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full text-[10px] font-semibold font-poppins text-primary uppercase z-20">
                  {product.category}
                </div>
                
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <>
                    {/* Abstract bambu ring effect */}
                    <div className="absolute w-28 h-28 border border-dashed border-secondary/40 rounded-full group-hover:scale-110 transition-transform duration-500" />
                    
                    <span className="text-6xl z-10 transition-transform group-hover:scale-110 duration-300">
                      {product.emoji}
                    </span>
                  </>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg font-poppins text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-primary font-semibold font-poppins bg-primary/5 inline-block px-2.5 py-1 rounded">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.desc}
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-border/40">
                  <a
                    href={`https://wa.me/${product.waNumber}?text=${encodeURIComponent(`Halo, saya tertarik memesan ${product.name} dari Desa Salawu.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "flex-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-poppins border-none flex items-center justify-center gap-1.5 shadow-sm"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Hubungi Pengrajin
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner Info */}
        <div className="mt-16 bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-bold text-lg font-poppins text-primary flex items-center justify-center md:justify-start gap-2">
              <CheckCircle2 className="h-5 w-5" /> Dukungan Pendampingan Digital
            </h4>
            <p className="text-sm text-muted-foreground max-w-xl">
              Melalui program pendampingan ini, pengrajin dibekali pelatihan kualitas produk, standardisasi harga, serta pemasaran digital untuk memperluas jangkauan pasar.
            </p>
          </div>
          <Link
            href="#kontak"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "rounded-full font-poppins whitespace-nowrap bg-background"
            )}
          >
            Pelajari Pendampingan <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
