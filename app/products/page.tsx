import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/lib/db";
import ProductCatalogClient from "./ProductCatalogClient";
import { ShoppingBag } from "lucide-react";

// Opt-out of static rendering if we want real-time dynamic products
export const revalidate = 0;

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins flex items-center justify-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-secondary" /> Pasar Digital Desa
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-foreground tracking-tight">
              Katalog Produk UMKM Salawu
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-sans leading-relaxed">
              Jelajahi berbagai karya kerajinan bambu orisinal buatan warga lokal. Setiap transaksi terhubung langsung ke WhatsApp pengrajin.
            </p>
          </div>

          {/* Interactive Catalog (Client Component) */}
          <ProductCatalogClient initialProducts={initialProducts} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
