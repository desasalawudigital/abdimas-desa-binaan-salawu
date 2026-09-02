"use client";

import React, { useState, useEffect } from "react";
import { Save, RefreshCw, Globe, Phone, Mail, MapPin, Video, Upload } from "lucide-react";
import { safeFetchJson } from "@/lib/image-compression";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733-16z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsData {
  instagram: string;
  facebook: string;
  tiktok: string;
  x_twitter: string;
  youtube: string;
  website: string;
  whatsapp: string;
  email: string;
  address: string;
  gmaps_link: string;
  hero_video_type: "none" | "youtube" | "local";
  hero_video_url: string;
}

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<SettingsData>({
    instagram: "",
    facebook: "",
    tiktok: "",
    x_twitter: "",
    youtube: "",
    website: "",
    whatsapp: "",
    email: "",
    address: "",
    gmaps_link: "",
    hero_video_type: "none",
    hero_video_url: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await safeFetchJson<{ url: string }>("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!result.ok || !result.data) {
        throw new Error(result.error || "Gagal mengunggah video");
      }

      setSettings(prev => ({ ...prev, hero_video_url: result.data!.url, hero_video_type: "local" }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Gagal mengambil data pengaturan");
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
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");

      setSuccessMsg("Pengaturan berhasil disimpan!");
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
            <Globe className="h-6 w-6 text-primary" /> Pengaturan Kontak
          </h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Atur tautan sosial media, nomor telepon, dan informasi kontak lainnya yang tampil di footer.
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

          {/* Sosial Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-poppins border-b border-border/40 pb-2">Sosial Media</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <InstagramIcon className="text-pink-600" /> Tautan Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <FacebookIcon className="text-blue-600" /> Tautan Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <TiktokIcon className="text-black dark:text-white" /> Tautan TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={settings.tiktok}
                  onChange={handleChange}
                  placeholder="https://tiktok.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <XIcon className="text-black dark:text-white" /> Tautan X (Twitter)
                </label>
                <input
                  type="url"
                  name="x_twitter"
                  value={settings.x_twitter}
                  onChange={handleChange}
                  placeholder="https://x.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <YoutubeIcon className="text-red-600" /> Tautan YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={settings.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-600" /> Tautan Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={settings.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>



          {/* Kontak & Alamat */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-poppins border-b border-border/40 pb-2">Kontak & Lokasi</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" /> Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleChange}
                  placeholder="6281234567890 (Gunakan format 62...)"
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-600" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="info@contoh.com"
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" /> Tautan Google Maps
                </label>
                <input
                  type="url"
                  name="gmaps_link"
                  value={settings.gmaps_link}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-foreground" /> Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  placeholder="Tuliskan alamat lengkap desa..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
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
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
