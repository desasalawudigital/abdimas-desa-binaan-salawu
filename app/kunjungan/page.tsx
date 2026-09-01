import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getVisits } from "@/lib/db";
import { Camera, Calendar, MapPin, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function KunjunganPage() {
  const visits = await getVisits();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins flex items-center justify-center gap-1.5">
              <Camera className="h-4 w-4 text-secondary" /> Galeri Lapangan
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-foreground tracking-tight">
              Dokumentasi Kunjungan Wisata
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-sans leading-relaxed">
              Catatan perjalanan, potret interaksi sosial, dan rangkaian program kerja di Desa Binaan Salawu.
            </p>
          </div>

          {/* Visits Timeline/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {visits.map((visit, index) => (
              <div
                key={visit.id}
                className="bg-background border border-border/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Photo representation box */}
                  <div className="aspect-video w-full bg-gradient-to-br from-primary/5 to-secondary/15 rounded-2xl flex items-center justify-center relative overflow-hidden border border-border/40 group">
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full text-[10px] font-semibold font-poppins text-primary z-20">
                      Kunjungan #{index + 1}
                    </div>
                    {visit.imageUrl ? (
                      <img src={visit.imageUrl} alt={visit.title} className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-7xl select-none z-10 group-hover:scale-110 transition-transform duration-300">{visit.imageEmoji}</span>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground font-poppins">
                      <Calendar className="h-3.5 w-3.5 text-secondary" />
                      <span>{visit.date}</span>
                    </div>
                    <h3 className="text-xl font-bold font-poppins text-foreground">
                      {visit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                      {visit.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-muted-foreground border-t border-border/40 pt-4 font-poppins">
                  <MapPin className="h-3.5 w-3.5 text-secondary" />
                  <span>Pusat Kegiatan Desa Salawu</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
