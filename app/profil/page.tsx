"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, Users, Palette, Home as HomeIcon, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilDesa() {
  const [activeTab, setActiveTab] = useState("sejarah");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  const tabs = [
    { id: "sejarah", label: "Sejarah & Geografis", icon: MapPin },
    { id: "demografi", label: "Demografi & Ekonomi", icon: Users },
    { id: "budaya", label: "Adat & Seni Budaya", icon: Palette },
    { id: "arsitektur", label: "Arsitektur Tradisional", icon: HomeIcon },
    { id: "peninggalan", label: "Situs Peninggalan", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Header Profil */}
        <div className="container mx-auto px-4 md:px-6 mb-12 text-center space-y-4">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins bg-primary/10 px-4 py-1.5 rounded-full inline-block">
            Mengenal Lebih Dekat
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-foreground tracking-tight">
            Profil Desa Salawu
          </h1>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Menyelami warisan budaya, sejarah panjang, serta potensi luar biasa yang dimiliki oleh masyarakat Desa Salawu, Kecamatan Salawu, Kabupaten Tasikmalaya.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar / Tabs (Horizontal Scroll on Mobile, Vertical Sticky on Desktop) */}
            <div className="lg:col-span-3 sticky top-20 lg:top-28 z-30 bg-background/95 backdrop-blur-md border border-border/60 rounded-2xl p-2 md:p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-none shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 lg:py-3 rounded-xl text-xs md:text-sm font-semibold font-poppins transition-all text-left shrink-0 whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground bg-muted/30 lg:bg-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 bg-background border border-border/50 rounded-3xl p-6 md:p-10 shadow-sm min-h-[60vh]">
              {/* TAB 1: SEJARAH & GEOGRAFIS */}
              {activeTab === "sejarah" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">01.</span> Sejarah & Geografis
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div 
                    className="space-y-4 text-muted-foreground leading-relaxed 
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-poppins [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 
                      [&>h4]:text-lg [&>h4]:font-bold [&>h4]:font-poppins [&>h4]:text-foreground [&>h4]:mt-4 [&>h4]:mb-2
                      [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                      [&>strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: settings?.profil_sejarah || "<p>Memuat konten...</p>" }}
                  />
                </div>
              )}

              {/* TAB 2: DEMOGRAFI & SOSIAL EKONOMI */}
              {activeTab === "demografi" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">02.</span> Demografi & Sosial Ekonomi
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div 
                    className="space-y-4 text-muted-foreground leading-relaxed 
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-poppins [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 
                      [&>h4]:text-lg [&>h4]:font-bold [&>h4]:font-poppins [&>h4]:text-foreground [&>h4]:mt-4 [&>h4]:mb-2
                      [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                      [&>strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: settings?.profil_demografi || "<p>Memuat konten...</p>" }}
                  />
                </div>
              )}

              {/* TAB 3: ADAT ISTIADAT & SENI */}
              {activeTab === "budaya" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">03.</span> Adat Istiadat & Seni Budaya
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div 
                    className="space-y-4 text-muted-foreground leading-relaxed 
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-poppins [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 
                      [&>h4]:text-lg [&>h4]:font-bold [&>h4]:font-poppins [&>h4]:text-foreground [&>h4]:mt-4 [&>h4]:mb-2
                      [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                      [&>strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: settings?.profil_budaya || "<p>Memuat konten...</p>" }}
                  />
                </div>
              )}

              {/* TAB 4: ARSITEKTUR */}
              {activeTab === "arsitektur" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">04.</span> Arsitektur Tradisional
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div 
                    className="space-y-4 text-muted-foreground leading-relaxed 
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-poppins [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 
                      [&>h4]:text-lg [&>h4]:font-bold [&>h4]:font-poppins [&>h4]:text-foreground [&>h4]:mt-4 [&>h4]:mb-2
                      [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                      [&>strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: settings?.profil_arsitektur || "<p>Memuat konten...</p>" }}
                  />
                </div>
              )}

              {/* TAB 5: PENINGGALAN */}
              {activeTab === "peninggalan" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-poppins text-foreground flex items-center gap-3">
                      <span className="text-primary">05.</span> Peninggalan & Teknologi
                    </h2>
                    <div className="w-20 h-1 bg-secondary rounded-full"></div>
                  </div>

                  <div 
                    className="space-y-4 text-muted-foreground leading-relaxed 
                      [&>h3]:text-xl [&>h3]:font-bold [&>h3]:font-poppins [&>h3]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 
                      [&>h4]:text-lg [&>h4]:font-bold [&>h4]:font-poppins [&>h4]:text-foreground [&>h4]:mt-4 [&>h4]:mb-2
                      [&>p]:text-justify [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                      [&>strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: settings?.profil_peninggalan || "<p>Memuat konten...</p>" }}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
