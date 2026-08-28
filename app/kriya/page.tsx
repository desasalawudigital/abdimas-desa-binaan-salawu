import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import fs from "fs";
import path from "path";

export default function KriyaPage() {
  const galleriesPath = path.join(process.cwd(), "data", "galleries.json");
  let seniAnyamanImages: string[] = [];
  try {
    const fileContent = fs.readFileSync(galleriesPath, "utf8");
    const data = JSON.parse(fileContent);
    seniAnyamanImages = data.seni_anyaman || [];
  } catch (e) {
    console.error("Failed to load galleries:", e);
  }

  const steps = [
    {
      num: "01",
      title: "Pemilihan Bambu",
      desc: "Memilih bambu tali atau gombong yang berumur sedang (tidak terlalu muda/tua) agar seratnya kuat namun lentur saat dianyam.",
      emoji: "🎋",
    },
    {
      num: "02",
      title: "Penyayatan & Penipisan",
      desc: "Bambu dipotong per ruas, dibelah, lalu disayat tipis-tipis (dihaluskan) menjadi lembaran pita bambu halus siap anyam.",
      emoji: "🔪",
    },
    {
      num: "03",
      title: "Pengeringan Alami",
      desc: "Lembaran pita bambu dijemur di bawah terik matahari langsung untuk mengurangi kadar air dan mencegah tumbuhnya jamur.",
      emoji: "☀️",
    },
    {
      num: "04",
      title: "Proses Penganyaman",
      desc: "Pita bambu dianyam menggunakan teknik silang ganda tradisional Sunda membentuk motif anyaman kerucut (aseupan) atau lembaran ceper.",
      emoji: "👐",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-secondary" /> Warisan Kebudayaan
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-foreground tracking-tight">
              Seni Kriya Anyaman & Aseupan Bambu
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-sans leading-relaxed">
              Mengenal lebih dekat warisan teknik kerajinan anyaman bambu leluhur yang ramah lingkungan dari Desa Binaan Salawu.
            </p>
          </div>

          {/* Feature Grid: Aseupan vs Anyaman */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
            {/* Box Aseupan */}
            <div className="bg-background border border-border/40 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <span className="text-5xl bg-primary/5 p-3 rounded-2xl">🏺</span>
                <div>
                  <h3 className="text-xl font-bold font-poppins text-foreground">Kerajinan Aseupan</h3>
                  <p className="text-xs text-muted-foreground">Alat Kukus Nasi Sunda Legendaris</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Aseupan adalah anyaman bambu berbentuk kerucut tradisional Pasundan yang digunakan untuk menanak nasi tumpeng atau kukusan masakan harian. Rongga sirkulasi udara anyaman membuat uap air mendistribusi secara merata, menghasilkan tekstur nasi kukus yang luar biasa pulen dan beraroma wangi bambu alami.
              </p>
              <div className="pt-2 border-t border-border/50 flex flex-wrap gap-2 text-xs font-semibold text-primary">
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ 100% Organik</span>
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ Tahan Panas Tinggi</span>
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ Bebas Mikroplastik</span>
              </div>
            </div>

            {/* Box Anyaman */}
            <div className="bg-background border border-border/40 p-8 rounded-3xl space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <span className="text-5xl bg-secondary/10 p-3 rounded-2xl">👜</span>
                <div>
                  <h3 className="text-xl font-bold font-poppins text-foreground">Kriya Anyaman Bambu</h3>
                  <p className="text-xs text-muted-foreground">Dekorasi Rumah & Perlengkapan Harian</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Mulai dari nyiru (tampi beras), boboko (wadah nasi), besek kemasan makanan (pipiti), hingga tas belanja modern yang estetik. Teknik anyaman anyam silang ganda (sasak) dan anyam tiga dimensi diajarkan secara lisan dari orang tua kepada anak-anaknya di Desa Salawu sebagai simbol kemandirian hidup berdampingan dengan alam.
              </p>
              <div className="pt-2 border-t border-border/50 flex flex-wrap gap-2 text-xs font-semibold text-primary">
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ Serat Bambu Pilihan</span>
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ Desain Estetis</span>
                <span className="bg-primary/5 px-3 py-1.5 rounded-full">✓ Ramah Lingkungan</span>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="space-y-12 mb-20">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins text-foreground">
                Galeri Seni Anyaman
              </h2>
              <p className="text-muted-foreground text-sm font-sans">
                Koleksi karya indah pengrajin Desa Wisata Salawu yang dibuat dengan penuh ketelitian dan kecintaan pada alam.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {seniAnyamanImages.length === 0 ? (
                <div className="col-span-full py-10 text-center text-muted-foreground italic text-sm">
                  Belum ada foto di galeri ini.
                </div>
              ) : (
                seniAnyamanImages.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-sm group">
                    <img 
                      src={imgUrl} 
                      alt={`Seni Anyaman Salawu ${idx+1}`} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Steps of Making Craft */}
          <div className="space-y-12 mb-20">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins text-foreground">
                Proses Pembuatan Anyaman
              </h2>
              <p className="text-muted-foreground text-sm font-sans">
                Setiap produk kerajinan melewati tahapan pengerjaan manual yang teliti demi menjaga keawetan dan nilai estetika produk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="bg-background border border-border/40 p-6 rounded-3xl relative space-y-4 shadow-sm group hover:border-primary/20 transition-all duration-300"
                >
                  <span className="absolute top-4 right-4 text-3xl font-bold font-poppins text-muted/30 group-hover:text-primary/10 select-none transition-colors">
                    {step.num}
                  </span>
                  <span className="text-4xl block pt-2">{step.emoji}</span>
                  <h3 className="font-bold text-lg font-poppins text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Abdimas Cultural Preservation Notice */}
          <div className="bg-primary text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold font-poppins">
                <FileText className="h-3.5 w-3.5 text-secondary" />
                <span>Pelestarian Kriya Bambu</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-poppins tracking-tight">
                Mendukung Masa Depan Hijau & Berkelanjutan
              </h3>
              <p className="text-white/80 text-sm leading-relaxed font-sans">
                Melalui website ini, program KKN Abdimas mengampanyekan pentingnya beralih ke peralatan bambu organik guna mengurangi limbah plastik dapur sekali pakai. Mari jadi bagian dari penyelamat lingkungan dengan mengadopsi kriya bambu Salawu.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-full font-poppins w-full sm:w-auto text-center"
                )}
              >
                Jelajahi Produk Kriya <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
