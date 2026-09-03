"use client";

import React, { useState, useEffect } from "react";
import { Save, RefreshCw, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WebContentData {
  hero_desc: string;
  about_title: string;
  about_desc_1: string;
  about_desc_2: string;
  visit_desc: string;
  culture_desc: string;
  cta_title: string;
  cta_desc: string;
}

export default function AdminWebContentClient() {
  const [settings, setSettings] = useState<WebContentData>({
    hero_desc: "",
    about_title: "",
    about_desc_1: "",
    about_desc_2: "",
    visit_desc: "",
    culture_desc: "",
    cta_title: "",
    cta_desc: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Gagal mengambil data konten website");
      const data = await res.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Fetch current settings first to not overwrite contact/social settings
      const getRes = await fetch("/api/settings");
      const currentSettings = await getRes.json();
      
      const payload = { ...currentSettings, ...settings };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan konten website");

      setSuccessMsg("Konten website berhasil disimpan!");
      window.dispatchEvent(new Event('settingsUpdated'));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-background rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Kelola Konten Teks Website
          </h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Ubah narasi dan deskripsi yang tampil di berbagai halaman website.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading || isSaving}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex items-center gap-2 font-poppins rounded-full",
            (isLoading || isSaving) && "opacity-70 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Muat Ulang
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm font-sans">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-xl text-sm font-sans border border-green-500/20">
          {successMsg}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-poppins border-b border-border/40 pb-2">Konten Teks Website</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold font-poppins text-foreground">Deskripsi Beranda (Bawah Judul)</label>
                <p className="text-xs text-muted-foreground mb-2">Teks pengantar yang muncul paling atas di halaman utama (Beranda), tepat di bawah judul besar "Desa Binaan Salawu".</p>
                <textarea
                  name="hero_desc"
                  value={settings.hero_desc}
                  onChange={handleChange}
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Tentang Desa */}
              <div className="space-y-2 md:col-span-2 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <h4 className="font-semibold text-sm font-poppins text-primary">Bagian Tentang Desa</h4>
                <p className="text-xs text-muted-foreground mb-3">Ditampilkan di bagian tengah halaman Beranda, di samping ilustrasi peta desa.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul</label>
                    <input
                      type="text"
                      name="about_title"
                      value={settings.about_title}
                      onChange={handleChange}
                      className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Paragraf 1</label>
                    <textarea
                      name="about_desc_1"
                      value={settings.about_desc_1}
                      onChange={handleChange}
                      className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Paragraf 2</label>
                    <textarea
                      name="about_desc_2"
                      value={settings.about_desc_2}
                      onChange={handleChange}
                      className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Kunjungan & Budaya */}
              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins text-foreground">Deskripsi Kunjungan Wisata</label>
                <p className="text-xs text-muted-foreground mb-2">Ditampilkan di halaman Beranda bagian "Dokumentasi Desa" (slider foto).</p>
                <textarea
                  name="visit_desc"
                  value={settings.visit_desc}
                  onChange={handleChange}
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins text-foreground">Deskripsi Alam & Budaya</label>
                <p className="text-xs text-muted-foreground mb-2">Ditampilkan di halaman Beranda bagian "Eksplorasi Keindahan Alam & Budaya Salawu".</p>
                <textarea
                  name="culture_desc"
                  value={settings.culture_desc}
                  onChange={handleChange}
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Call to Action */}
              <div className="space-y-2 md:col-span-2 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <h4 className="font-semibold text-sm font-poppins text-secondary">Bagian Ajakan Kunjungan (Bawah Budaya)</h4>
                <p className="text-xs text-muted-foreground mb-3">Ditampilkan di bagian paling bawah halaman Beranda (sebelum footer) untuk mengajak pengunjung datang.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Judul</label>
                    <input
                      type="text"
                      name="cta_title"
                      value={settings.cta_title}
                      onChange={handleChange}
                      className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Deskripsi</label>
                    <textarea
                      name="cta_desc"
                      value={settings.cta_desc}
                      onChange={handleChange}
                      className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/40">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full px-8 py-6 h-auto text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              )}
            >
              <Save className={cn("h-5 w-5", isSaving && "animate-pulse")} />
              {isSaving ? "Menyimpan..." : "Simpan Konten Website"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
