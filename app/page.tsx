import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import VideoSection from "@/components/sections/VideoSection";
import KunjunganWisataSection from "@/components/sections/KunjunganWisataSection";
import BudayaWisataSection from "@/components/sections/BudayaWisataSection";
import { Leaf, ShieldCheck, Award, Heart, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/db";

export const revalidate = 0;

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigasi */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner Section */}
        <HeroSection />

        {/* Dedicated Video Section */}
        <VideoSection />

        {/* Tentang Kami / Sekilas Desa Section */}
        <section id="tentang" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column: Visual grid of value propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {/* Background soft circular blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-2xl -z-10 pointer-events-none" />

                <div className="bg-muted/40 border border-border/40 p-6 rounded-3xl space-y-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg font-poppins text-foreground">Ramah Lingkungan</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Setiap produk anyaman dibuat menggunakan bahan bambu alami tanpa polutan plastik.
                  </p>
                </div>

                <div className="bg-muted/40 border border-border/40 p-6 rounded-3xl space-y-3 transform translate-y-6 rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="p-3 bg-secondary/15 rounded-2xl w-fit text-secondary-foreground">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg font-poppins text-foreground">Kualitas Autentik</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ditenun secara manual oleh warga pengrajin lokal berpengalaman selama puluhan tahun.
                  </p>
                </div>

                <div className="bg-muted/40 border border-border/40 p-6 rounded-3xl space-y-3 transform -translate-y-2 -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="p-3 bg-secondary/15 rounded-2xl w-fit text-secondary-foreground">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg font-poppins text-foreground">Pemberdayaan Desa</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Setiap pembelian berkontribusi langsung pada pendapatan keluarga pengrajin di desa.
                  </p>
                </div>

                <div className="bg-muted/40 border border-border/40 p-6 rounded-3xl space-y-3 transform translate-y-4 rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg font-poppins text-foreground">Pendampingan Digital</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Didukung bimbingan intensif untuk modernisasi kemasan dan legalitas UMKM.
                  </p>
                </div>
              </div>

              {/* Right Column: Detailed narrative */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins">
                    Nilai Luhur Desa
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground tracking-tight leading-tight">
                    Membangun Kemandirian Ekonomi Melalui Warisan Tradisi
                  </h2>
                </div>
                
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans">
                  Desa Salawu, Tasikmalaya merupakan salah satu daerah penghasil kriya anyaman bambu tertua di Jawa Barat. Keahlian ini telah diwariskan dari generasi ke generasi, menjadikan bambu sebagai urat nadi perekonomian masyarakat.
                </p>

                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-sans">
                  Melalui program pendampingan digitalisasi ini, kami berkomitmen mendukung para pengrajin dalam bertransformasi secara digital. Tujuan utama kami adalah meningkatkan daya saing UMKM lokal, melestarikan warisan seni budaya, dan memperkenalkan potensi wisata alam Salawu ke khalayak luas.
                </p>

                <div className="pt-2">
                  <Link 
                    href="/profil" 
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }), 
                      "rounded-full font-poppins flex items-center gap-2 w-fit"
                    )}
                  >
                    Baca Profil Lengkap <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="p-4 border-l-4 border-secondary bg-secondary/5 rounded-r-2xl space-y-1">
                  <p className="italic text-sm text-foreground/95 font-medium font-sans">
                    &quot;Kahuripan Sunda teh salawasna nyanding dina getih kulawarga urang Salawu, anu ngaraksa tur ngariksa pusaka karuhun ku cara nganyam lambang kahirupan.&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold font-poppins uppercase">
                    — Tokoh Adat / Budayawan Salawu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kunjungan Wisata Showcase Section */}
        <KunjunganWisataSection />

        {/* Wisata & Budaya Section */}
        <BudayaWisataSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}