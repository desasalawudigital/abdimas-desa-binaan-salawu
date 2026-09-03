import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProductById } from "@/lib/db";
import { ArrowLeft, MessageCircle, Ruler, Store, ShieldCheck, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Opt-out of static rendering if we want real-time dynamic products
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 flex flex-col items-center justify-center space-y-4">
          <span className="text-6xl">🏺</span>
          <h1 className="text-2xl font-bold font-poppins text-foreground">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-sm max-w-xs text-center">
            Produk yang Anda cari mungkin telah dihapus atau URL tidak valid.
          </p>
          <Link href="/products" className={cn(buttonVariants({ variant: "default" }), "rounded-full")}>
            Kembali ke Katalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const waText = `Halo, saya tertarik dengan produk "${product.name}" buatan ${product.craftsman} dari website Desa Salawu. Apakah masih tersedia?`;
  const waUrl = `https://wa.me/${product.waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 font-poppins transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
          </Link>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-background border border-border/40 rounded-3xl p-6 md:p-10 shadow-sm">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative aspect-square bg-gradient-to-br from-primary/5 to-secondary/15 rounded-2xl flex items-center justify-center overflow-hidden border border-border/40 group">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <>
                  <div className="absolute w-44 h-44 border border-dashed border-secondary/30 rounded-full" />
                  <span className="text-9xl z-10 select-none animate-in zoom-in duration-300">
                    {product.emoji}
                  </span>
                </>
              )}
            </div>

            {/* Information Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary font-semibold font-poppins uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold font-poppins text-foreground tracking-tight pt-1">
                    {product.name}
                  </h1>
                  <p className="text-2xl font-bold text-primary font-poppins pt-2">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans">
                  {product.desc}
                </p>

                {/* Attributes Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-border/60 py-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <Ruler className="h-5 w-5 text-secondary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dimensi Produk</p>
                      <p className="font-semibold text-foreground">{product.dimensions || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Store className="h-5 w-5 text-secondary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Stok Tersedia</p>
                      <p className="font-semibold text-foreground">{product.stock} unit</p>
                    </div>
                  </div>
                </div>

                {/* Craftsman Badge */}
                <div className="flex items-center space-x-3 bg-muted/30 border border-border/40 p-4 rounded-2xl">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-xs text-muted-foreground">Pengrajin Pembuat</p>
                    <p className="font-bold text-sm text-foreground font-poppins">{product.craftsman}</p>
                  </div>
                </div>
              </div>

              {/* Order / WhatsApp Checkout Button */}
              <div className="space-y-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-poppins border-none flex items-center justify-center gap-2 shadow-md transition-all py-6 text-base"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Pesan via WhatsApp
                </a>
                <p className="text-center text-[10px] text-muted-foreground font-sans">
                  Pemesanan dilakukan langsung ke produsen desa untuk memastikan harga terbaik tanpa biaya admin broker.
                </p>
              </div>
            </div>
          </div>

          {/* Quality Guarantee Notice */}
          <div className="mt-10 bg-primary/[0.02] border border-primary/10 rounded-2xl p-5 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm font-poppins text-primary">Jaminan Keaslian Kriya Salawu</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Produk ini terdaftar secara resmi sebagai produk kriya unggulan Desa Salawu. Dibuat 100% dari bambu lokal Tasikmalaya berkualitas tinggi yang ramah lingkungan dan bersumber lestari.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
