import React from "react";
import { Compass, Camera, MapPin } from "lucide-react";

interface AlamBudayaItem {
  url: string;
  title: string;
  desc: string;
}

import { getGalleries, getSettings } from "@/lib/db";

export default async function BudayaWisataSection() {
  let alamBudayaImages: AlamBudayaItem[] = [];
  let settings: Record<string, string> = {};
  
  try {
    settings = await getSettings();
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
  try {
    const data = await getGalleries();
    alamBudayaImages = data?.alam_budaya || [];
  } catch (e) {
    console.error("Failed to load galleries for homepage:", e);
  }

  return (
    <section id="wisata" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16 max-w-3xl">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-secondary" /> Pesona Desa Binaan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-foreground tracking-tight">
            Eksplorasi Keindahan Alam & Budaya Salawu
          </h2>
          <p className="text-muted-foreground text-base font-sans whitespace-pre-wrap mt-2 leading-relaxed">
            {settings.culture_desc || "Dari keasrian pegunungan Priangan Timur hingga harmoni irama bambu tradisional yang terjaga lestari secara turun-temurun."}
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {alamBudayaImages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border/60 rounded-2xl font-sans">
              Belum ada data foto untuk Eksplorasi Keindahan Alam & Budaya.
            </div>
          ) : (
            alamBudayaImages.map((item, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-border/40 overflow-hidden min-h-[300px] flex flex-col justify-end p-8 group shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {/* Premium gradient and visual pattern background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0" 
                />
                
                {/* Dark overlay backdrop for readability that fades on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-90 transition-opacity duration-300 z-10 pointer-events-none" />

                {/* Info Area */}
                <div className="space-y-3 relative z-20 text-white">
                  <h3 className="text-2xl font-bold font-poppins flex items-center gap-1.5">
                    {item.title}
                  </h3>
                  
                  <p className="text-white/90 text-sm leading-relaxed max-w-xl font-sans opacity-90 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>

                  <div className="flex items-center space-x-1.5 text-xs text-white/70 pt-2 font-poppins">
                    <MapPin className="h-3.5 w-3.5 text-secondary" />
                    <span>Desa Salawu, Tasikmalaya, Jawa Barat</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Visual Call to Action or Photography Tip */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-primary to-primary-foreground p-8 md:p-12 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold font-poppins">
              <Camera className="h-3.5 w-3.5 text-secondary" />
              <span>Dukungan Desa Wisata</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-poppins tracking-tight whitespace-pre-wrap">
              {settings.cta_title || "Ingin Berwisata Edukasi ke Desa Salawu?"}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed font-sans whitespace-pre-wrap">
              {settings.cta_desc || "Kami siap memandu rombongan wisatawan, institusi pendidikan, maupun jurnalis yang tertarik mengkaji industri kerajinan bambu lokal serta ekowisata alam. Hubungi tim sekretariat desa untuk koordinasi kunjungan."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
