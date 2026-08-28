"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight } from "lucide-react";
import { Product } from "@/lib/db";
import { cn } from "@/lib/utils";

interface Props {
  initialProducts: Product[];
}

export default function ProductCatalogClient({ initialProducts }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("semua");
  const [sortBy, setSortBy] = useState("default");

  const categories = [
    { value: "semua", label: "Semua Kategori" },
    { value: "dapur", label: "Peralatan Dapur" },
    { value: "dekorasi", label: "Dekorasi Ruang" },
    { value: "fashion", label: "Fashion & Gaya Hidup" },
    { value: "makanan", label: "Makanan Lokal" },
    { value: "minuman", label: "Minuman Lokal" },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Search
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query) ||
          p.craftsman.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (category !== "semua") {
      result = result.filter((p) => p.category === category);
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [initialProducts, search, category, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Panel */}
      <div className="bg-background rounded-3xl border border-border/50 p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama produk, pengrajin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-3 relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 relative">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-muted/40 border border-border/60 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all appearance-none cursor-pointer"
          >
            <option value="default">Urutkan: Default</option>
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
            <option value="name-asc">Nama: A - Z</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border/60 space-y-3">
          <span className="text-5xl">🔍</span>
          <h3 className="text-lg font-bold font-poppins text-foreground">Produk Tidak Ditemukan</h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Coba gunakan kata kunci pencarian lain atau ganti filter kategori.
          </p>
        </div>
      )}

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-background rounded-3xl border border-border/50 overflow-hidden shadow-sm flex flex-col group hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/15 flex items-center justify-center border-b border-border/40 overflow-hidden group">
              <span className="text-xs bg-background/90 backdrop-blur-sm border border-border/40 px-3 py-1 rounded-full text-primary font-semibold font-poppins absolute top-4 left-4 uppercase tracking-wider z-20">
                {product.category}
              </span>
              
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <>
                  <div className="absolute w-28 h-28 border border-dashed border-secondary/40 rounded-full group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-6xl z-10 transition-transform group-hover:scale-115 duration-300">
                    {product.emoji}
                  </span>
                </>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-lg font-poppins text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-base text-primary font-bold font-poppins">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {product.desc}
                </p>
              </div>

              {/* Card Footer Detail Indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground font-poppins">
                <span>Oleh: {product.craftsman}</span>
                <span className="text-primary font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Detail <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
