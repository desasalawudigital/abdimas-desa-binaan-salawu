"use client";

import React, { useState, useEffect } from "react";
import { Save, RefreshCw, Landmark } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import untuk react-quill agar tidak error SSR di Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ProfilData {
  profil_sejarah: string;
  profil_demografi: string;
  profil_budaya: string;
  profil_arsitektur: string;
  profil_peninggalan: string;
}

export default function AdminProfilClient() {
  const [settings, setSettings] = useState<ProfilData>({
    profil_sejarah: "",
    profil_demografi: "",
    profil_budaya: "",
    profil_arsitektur: "",
    profil_peninggalan: ""
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
      if (!res.ok) throw new Error("Gagal mengambil data profil desa");
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
      const getRes = await fetch("/api/settings");
      const currentSettings = await getRes.json();
      
      const payload = { ...currentSettings, ...settings };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil desa");

      setSuccessMsg("Profil desa berhasil disimpan!");
      window.dispatchEvent(new Event('settingsUpdated'));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuillChange = (value: string, name: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="bg-background rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm space-y-8 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-foreground flex items-center gap-2">
            <Landmark className="h-6 w-6 text-primary" /> Kelola Profil Desa
          </h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Ubah konten profil desa menggunakan editor teks lengkap (mendukung tebal, miring, list, dll).
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
            <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-10">
          
          <div className="space-y-3">
            <label className="text-base font-bold font-poppins text-foreground border-b pb-2 block border-border/40">
              1. Sejarah & Geografis
            </label>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ReactQuill 
                theme="snow" 
                value={settings.profil_sejarah} 
                onChange={(content) => handleQuillChange(content, 'profil_sejarah')} 
                modules={modules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-base font-bold font-poppins text-foreground border-b pb-2 block border-border/40">
              2. Demografi & Sosial Ekonomi
            </label>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ReactQuill 
                theme="snow" 
                value={settings.profil_demografi} 
                onChange={(content) => handleQuillChange(content, 'profil_demografi')} 
                modules={modules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-base font-bold font-poppins text-foreground border-b pb-2 block border-border/40">
              3. Adat Istiadat & Seni Budaya
            </label>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ReactQuill 
                theme="snow" 
                value={settings.profil_budaya} 
                onChange={(content) => handleQuillChange(content, 'profil_budaya')} 
                modules={modules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-base font-bold font-poppins text-foreground border-b pb-2 block border-border/40">
              4. Arsitektur Tradisional
            </label>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ReactQuill 
                theme="snow" 
                value={settings.profil_arsitektur} 
                onChange={(content) => handleQuillChange(content, 'profil_arsitektur')} 
                modules={modules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-base font-bold font-poppins text-foreground border-b pb-2 block border-border/40">
              5. Peninggalan & Teknologi
            </label>
            <div className="bg-white rounded-lg overflow-hidden border border-border">
              <ReactQuill 
                theme="snow" 
                value={settings.profil_peninggalan} 
                onChange={(content) => handleQuillChange(content, 'profil_peninggalan')} 
                modules={modules}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-border/40">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full px-8 py-6 h-auto text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              )}
            >
              <Save className={cn("h-5 w-5", isSaving && "animate-pulse")} />
              {isSaving ? "Menyimpan..." : "Simpan Profil Desa"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
