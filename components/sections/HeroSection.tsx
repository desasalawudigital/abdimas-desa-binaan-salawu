import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import fs from "fs";
import path from "path";

interface MediaItemWithMeta {
  url: string;
  title: string;
  desc: string;
}



import { getGalleries, getProducts, getSettings } from "@/lib/db";

export default async function HeroSection() {
  let heroImage: MediaItemWithMeta | null = null;
  let alamBudayaCount = 0;
  let productsCount = 0;
  let craftsmenCount = 0;
  let settings: any = {};

  try {
    settings = await getSettings();
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  try {
    const data = await getGalleries();
    heroImage = data?.hero_image || null;
    alamBudayaCount = data?.alam_budaya?.length || 0;
  } catch (e) {
    console.error("Failed to load galleries for hero:", e);
  }

  try {
    const products = await getProducts();
    productsCount = products.length;
    const uniqueCraftsmen = new Set(products.map((p) => p.craftsman?.trim()).filter(Boolean));
    craftsmenCount = uniqueCraftsmen.size;
  } catch (e) {
    console.error("Failed to load products for hero:", e);
  }

  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background"
    >
      {/* Background blobs for visual interest */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 -z-10 pointer-events-none" />



      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Heading and copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold font-poppins shadow-sm">
            <span>Desa Wisata Salawu 2026</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins tracking-tight leading-none text-foreground">
            Lestarikan Budaya, <br />
            <span className="text-primary">Kembangkan Potensi</span> <br />
            UMKM Desa Salawu
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans whitespace-pre-wrap">
            {settings.hero_desc || "Portal resmi Desa Binaan Salawu, Kabupaten Tasikmalaya. Pusat inovasi UMKM kriya bambu alami, kuliner lokal khas, dan ekowisata perdesaan."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto rounded-full group font-semibold")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Lihat Katalog UMKM
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#tentang"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto rounded-full font-semibold border-primary/20 hover:bg-primary/5 hover:text-primary group")}
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Statistics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-8 border-t border-border/60 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary font-poppins">{craftsmenCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Pengrajin Bambu</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary font-poppins">{productsCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Varian Anyaman</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary font-poppins">{alamBudayaCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Wisata Unggulan</p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase Mockup */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-sm md:max-w-md aspect-square bg-gradient-to-tr from-primary/20 to-secondary/30 rounded-3xl p-6 shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden group">
            {/* Inner glass overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-background/85 backdrop-blur-md rounded-2xl p-5 border border-border/40 shadow-lg z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary font-poppins tracking-wider uppercase">
                  Kerajinan Unggulan
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <MapPin className="h-3 w-3 text-secondary" /> Salawu, Tasikmalaya
                </span>
              </div>
              <h3 className="font-bold text-base text-foreground font-poppins">
                {heroImage ? heroImage.title : "Aseupan & Anyaman Bambu Tradisional"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {heroImage ? heroImage.desc : "Dibuat langsung oleh tangan-tangan terampil warga desa menggunakan bambu pilihan dengan teknik turun-temurun."}
              </p>
            </div>

            {/* Decorative organic shape representing craftsmanship/bamboo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-secondary/30 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-primary/20 rounded-full pointer-events-none" />
            
            {/* Visual representation of an aseupan/anyaman (abstract overlay styling) */}
            <div className="w-full h-full rounded-2xl bg-radial from-secondary/40 to-primary/40 flex items-center justify-center relative overflow-hidden">
              {heroImage && heroImage.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={heroImage.url} 
                  alt="Kerajinan Unggulan" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:10px_10px] pointer-events-none" />
                  <div className="w-40 h-40 bg-background/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center flex-col p-4 text-center transform -rotate-6 shadow-2xl transition-transform group-hover:rotate-0 duration-500">
                    <span className="text-3xl">🏺</span>
                    <span className="text-xs font-bold font-poppins mt-2 text-foreground">Aseupan Bambu</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Ramah Lingkungan & Estetik</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
