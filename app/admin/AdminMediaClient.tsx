"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Copy, Check, RefreshCw, Trash2, Plus, X, Upload, Pencil, Video } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compressImage, safeFetchJson } from "@/lib/image-compression";

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

interface MediaItemWithMeta {
  url: string;
  title: string;
  desc: string;
}

interface GalleriesData {
  seni_anyaman: string[];
  alam_budaya: MediaItemWithMeta[];
  hero_image: MediaItemWithMeta | null;
}

interface VideoSettings {
  hero_video_type: "none" | "youtube" | "local";
  hero_video_url: string;
}

type TabType = "seni_anyaman" | "alam_budaya" | "hero_image" | "hero_video";

export default function AdminMediaClient() {
  const [galleries, setGalleries] = useState<GalleriesData>({ seni_anyaman: [], alam_budaya: [], hero_image: null });
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({ hero_video_type: "none", hero_video_url: "" });
  const [availableMedia, setAvailableMedia] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("seni_anyaman");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [metaModal, setMetaModal] = useState<{isOpen: boolean, url: string, title: string, desc: string, editIndex?: number}>({
    isOpen: false,
    url: "",
    title: "",
    desc: ""
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileToUpload = await compressImage(file);
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const result = await safeFetchJson<{ url: string }>("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!result.ok || !result.data) {
        throw new Error(result.error || "Gagal mengunggah foto");
      }

      const data = result.data;
      
      // Update available media
      setAvailableMedia(prev => [...prev, data.url]);
      
      // Automatically add to active gallery for better UX
      if (activeTab === "alam_budaya" || activeTab === "hero_image") {
        setMetaModal(prev => ({ 
          ...prev, 
          isOpen: true, 
          url: data.url,
          title: prev.isOpen ? prev.title : "",
          desc: prev.isOpen ? prev.desc : "" 
        }));
      } else {
        const updatedGallery = [...galleries.seni_anyaman, data.url];
        await saveGalleries({
          ...galleries,
          seni_anyaman: updatedGallery
        });
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal mengunggah video");

      const data = await res.json();
      const newSettings = { ...videoSettings, hero_video_url: data.url, hero_video_type: "local" as const };
      setVideoSettings(newSettings);
      await saveVideoSettings(newSettings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  };

  const submitMetaModal = () => {
    if (!metaModal.title) {
      alert("Harap isi Judul!");
      return;
    }
    const newItem = {
      url: metaModal.url,
      title: metaModal.title,
      desc: metaModal.desc || ""
    };
    
    if (activeTab === "alam_budaya") {
      let updatedGallery = [...galleries.alam_budaya];
      if (metaModal.editIndex !== undefined && metaModal.editIndex >= 0) {
        updatedGallery[metaModal.editIndex] = newItem;
      } else {
        updatedGallery.push(newItem);
      }
      saveGalleries({ ...galleries, alam_budaya: updatedGallery });
    } else if (activeTab === "hero_image") {
      saveGalleries({ ...galleries, hero_image: newItem });
    }
    setMetaModal({ isOpen: false, url: "", title: "", desc: "" });
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [galleriesRes, mediaRes, settingsRes] = await Promise.all([
        fetch("/api/galleries"),
        fetch("/api/media"),
        fetch("/api/settings")
      ]);
      
      if (!galleriesRes.ok || !mediaRes.ok || !settingsRes.ok) throw new Error("Gagal mengambil data");
      
      const data = await galleriesRes.json();
      const mediaData = await mediaRes.json();
      const settingsData = await settingsRes.json();
      
      setGalleries({
        seni_anyaman: data.seni_anyaman || [],
        alam_budaya: data.alam_budaya || [],
        hero_image: data.hero_image || null
      });
      setAvailableMedia(mediaData);
      setVideoSettings({
        hero_video_type: settingsData.hero_video_type || "none",
        hero_video_url: settingsData.hero_video_url || ""
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveGalleries = async (newGalleries: GalleriesData) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGalleries)
      });
      if (!res.ok) throw new Error("Gagal menyimpan galeri");
      setGalleries(newGalleries);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveVideoSettings = async (newSettings: VideoSettings) => {
    setIsSaving(true);
    setError(null);
    try {
      // First fetch current settings to preserve other fields
      const currentRes = await fetch("/api/settings");
      let currentSettings = {};
      if (currentRes.ok) {
        currentSettings = await currentRes.json();
      }
      
      const mergedSettings = { ...currentSettings, ...newSettings };
      
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedSettings)
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan pengaturan video");
      setVideoSettings(newSettings);
      window.dispatchEvent(new Event('settingsUpdated'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoSettingsChange = (field: keyof VideoSettings, value: string) => {
    const newSettings = { ...videoSettings, [field]: value };
    setVideoSettings(newSettings);
    
    // Auto save for radio buttons, wait for "Enter" or blur for text inputs if we wanted, 
    // but we can just add a save button or auto-save.
    // For type changes, let's auto-save
    if (field === "hero_video_type") {
      saveVideoSettings(newSettings);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    let updatedGallery;
    if (activeTab === "seni_anyaman") {
      updatedGallery = galleries.seni_anyaman.filter((_, idx) => idx !== indexToRemove);
      saveGalleries({ ...galleries, seni_anyaman: updatedGallery });
    } else if (activeTab === "hero_image") {
      saveGalleries({ ...galleries, hero_image: null });
    } else {
      updatedGallery = galleries.alam_budaya.filter((_, idx) => idx !== indexToRemove);
      saveGalleries({ ...galleries, alam_budaya: updatedGallery });
    }
  };

  const handleAddImage = (url: string) => {
    if (activeTab === "seni_anyaman") {
      if (galleries.seni_anyaman.includes(url)) return;
      const updatedGallery = [...galleries.seni_anyaman, url];
      saveGalleries({ ...galleries, seni_anyaman: updatedGallery });
      setIsModalOpen(false);
    } else if (activeTab === "hero_image") {
      setIsModalOpen(false);
      setMetaModal(prev => ({ 
        ...prev, 
        isOpen: true, 
        url: url,
        title: prev.isOpen ? prev.title : "",
        desc: prev.isOpen ? prev.desc : "" 
      }));
    } else {
      if (galleries.alam_budaya.some(item => item.url === url)) return;
      setIsModalOpen(false);
      setMetaModal(prev => ({ 
        ...prev, 
        isOpen: true, 
        url: url,
        title: prev.isOpen ? prev.title : "",
        desc: prev.isOpen ? prev.desc : "" 
      }));
    }
  };

  return (
    <div className="bg-background rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-foreground flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" /> Kelola Media
          </h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Atur foto-foto galeri, foto utama, dan video latar belakang beranda.
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

      {/* Gallery Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("seni_anyaman")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 font-poppins shadow-sm",
              activeTab === "seni_anyaman"
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Galeri Seni Anyaman
          </button>
          <button
            onClick={() => setActiveTab("alam_budaya")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 font-poppins shadow-sm",
              activeTab === "alam_budaya"
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Alam & Budaya
          </button>
          <button
            onClick={() => setActiveTab("hero_image")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 font-poppins shadow-sm",
              activeTab === "hero_image"
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Foto Utama (Beranda)
          </button>
          <button
            onClick={() => setActiveTab("hero_video")}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 font-poppins shadow-sm",
              activeTab === "hero_video"
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Latar Belakang Video
          </button>
        </div>

      {/* Gallery Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg font-poppins text-foreground">
            {activeTab === "seni_anyaman" ? "Foto Seni Anyaman" : activeTab === "alam_budaya" ? "Foto Alam & Budaya" : activeTab === "hero_image" ? "Foto Utama Beranda" : "Latar Belakang Video"}
          </h3>
          {activeTab !== "hero_video" && (
            <div className="flex items-center gap-2">
              <label
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "flex items-center gap-2 font-poppins rounded-full cursor-pointer",
                  isUploading && "opacity-70 cursor-not-allowed"
                )}
              >
                <Upload className={cn("h-4 w-4", isUploading && "animate-bounce")} />
                <span className="hidden sm:inline">{isUploading ? "Mengunggah..." : "Unggah dari Perangkat"}</span>
                <span className="sm:hidden">{isUploading ? "..." : "Unggah"}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
              </label>
              <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "flex items-center gap-2 font-poppins rounded-full"
                )}
              >
                <Plus className="h-4 w-4" /> 
                <span className="hidden sm:inline">Pilih dari Sistem</span>
                <span className="sm:hidden">Pilih</span>
              </button>
            </div>
          )}
        </div>

        {activeTab === "hero_video" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-sans">
              Tambahkan video latar belakang yang dinamis untuk bagian utama (Hero) website. Anda dapat menggunakan tautan YouTube atau mengunggah video dari perangkat Anda (.mp4/.webm).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => handleVideoSettingsChange("hero_video_type", "none")}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center",
                  videoSettings.hero_video_type === "none" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border/60 hover:border-primary/50"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-bold text-muted-foreground">X</span>
                </div>
                <h4 className="font-semibold font-poppins text-sm">Tidak Ada</h4>
                <p className="text-xs text-muted-foreground font-sans">Gunakan gaya bawaan.</p>
              </div>

              <div 
                onClick={() => handleVideoSettingsChange("hero_video_type", "youtube")}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center",
                  videoSettings.hero_video_type === "youtube" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border/60 hover:border-primary/50"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <YoutubeIcon className="text-red-600 h-5 w-5" />
                </div>
                <h4 className="font-semibold font-poppins text-sm">Link YouTube</h4>
                <p className="text-xs text-muted-foreground font-sans">Sematkan video YT.</p>
              </div>

              <div 
                onClick={() => handleVideoSettingsChange("hero_video_type", "local")}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center",
                  videoSettings.hero_video_type === "local" ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border/60 hover:border-primary/50"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="text-blue-600 h-5 w-5" />
                </div>
                <h4 className="font-semibold font-poppins text-sm">File Lokal</h4>
                <p className="text-xs text-muted-foreground font-sans">Unggah video perangkat.</p>
              </div>
            </div>

            {videoSettings.hero_video_type === "youtube" && (
              <div className="space-y-2 mt-4 p-4 bg-muted/20 border border-border/50 rounded-xl">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  Tautan YouTube
                </label>
                <input
                  type="url"
                  name="hero_video_url"
                  value={videoSettings.hero_video_url || ""}
                  onChange={(e) => {
                    const newSettings = { ...videoSettings, hero_video_url: e.target.value };
                    setVideoSettings(newSettings);
                  }}
                  onBlur={() => saveVideoSettings(videoSettings)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveVideoSettings(videoSettings);
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground">URL video YouTube yang akan diputar otomatis tanpa suara di latar belakang. Tekan Enter atau klik di luar kotak untuk menyimpan.</p>
              </div>
            )}

            {videoSettings.hero_video_type === "local" && (
              <div className="space-y-3 mt-4 p-4 bg-muted/20 border border-border/50 rounded-xl">
                <label className="text-sm font-semibold font-poppins flex items-center gap-2">
                  File Video Lokal
                </label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex items-center gap-2 font-poppins rounded-full cursor-pointer shrink-0",
                      isUploadingVideo && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    <Upload className={cn("h-4 w-4", isUploadingVideo && "animate-bounce")} />
                    <span>{isUploadingVideo ? "Mengunggah..." : "Pilih File Video"}</span>
                    <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={handleUploadVideo} disabled={isUploadingVideo} />
                  </label>
                  
                  {videoSettings.hero_video_url && (
                    <div className="text-xs font-sans truncate px-3 py-2 bg-background border border-border/50 rounded-lg max-w-full">
                      Tersimpan: <span className="font-semibold text-primary">{videoSettings.hero_video_url.split('/').pop()}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Gunakan file berukuran kecil (.mp4 atau .webm) agar website tetap dimuat dengan cepat.</p>
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square bg-muted/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (activeTab === "seni_anyaman" && galleries.seni_anyaman.length === 0) || 
         (activeTab === "alam_budaya" && galleries.alam_budaya.length === 0) ||
         (activeTab === "hero_image" && !galleries.hero_image) ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/10">
            <div className="bg-muted p-4 rounded-full mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-sans max-w-sm">
              Belum ada media di kategori ini. Klik "Tambah Media" untuk mengelola galeri.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activeTab === "hero_image" ? (
              galleries.hero_image ? (
                <div className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={galleries.hero_image.url} alt={`Foto Utama Beranda`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs z-10">
                    <p className="font-bold truncate">{galleries.hero_image.title}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 z-20">
                    <button
                      onClick={() => setMetaModal({ isOpen: true, url: galleries.hero_image!.url, title: galleries.hero_image!.title, desc: galleries.hero_image!.desc })}
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-transform hover:scale-110"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(0)}
                      disabled={isSaving}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 transition-transform hover:scale-110"
                      title="Hapus dari Galeri"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="col-span-full py-16 text-center text-muted-foreground border-2 border-dashed border-border/60 rounded-2xl bg-muted/10 font-sans">
                  Belum ada Foto Utama. Silakan klik Tambah Foto.
                </div>
              )
            ) : activeTab === "seni_anyaman" ? (
              galleries.seni_anyaman.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Galeri ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      disabled={isSaving}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 transition-transform hover:scale-110"
                      title="Hapus dari Galeri"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              galleries.alam_budaya.map((item, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={`Galeri ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    <p className="font-bold truncate">{item.title}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => setMetaModal({ isOpen: true, url: item.url, title: item.title, desc: item.desc, editIndex: idx })}
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-transform hover:scale-110"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      disabled={isSaving}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 transition-transform hover:scale-110"
                      title="Hapus dari Galeri"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal for selecting media */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-bold text-xl font-poppins">Pilih Media dari Sistem</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-muted/10">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {availableMedia.map((url, idx) => {
                  const isSelected = activeTab === "seni_anyaman" 
                    ? galleries.seni_anyaman.includes(url)
                    : activeTab === "hero_image"
                      ? galleries.hero_image?.url === url
                      : galleries.alam_budaya.some(item => item.url === url);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => !isSelected && handleAddImage(url)}
                      className={cn(
                        "group relative aspect-square rounded-xl overflow-hidden border cursor-pointer",
                        isSelected 
                          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background opacity-50 cursor-not-allowed" 
                          : "border-border/50 hover:border-primary/50 transition-colors"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                          <Check className="h-8 w-8 text-primary drop-shadow-md" />
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 border-t border-border/40 flex justify-end bg-background">
              <button
                onClick={() => setIsModalOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meta Data Modal (Title & Description) */}
      {metaModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border/40 flex justify-between items-center">
              <h3 className="font-bold text-xl font-poppins">Detail Foto Alam & Budaya</h3>
              <button 
                onClick={() => setMetaModal({ isOpen: false, url: "", title: "", desc: "" })}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="relative group rounded-xl overflow-hidden bg-muted/20 border border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={metaModal.url} alt="Preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-2 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4" /> Unggah Baru
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                  </label>
                  <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-colors">
                    <ImageIcon className="w-4 h-4" /> Pilih Sistem
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins">Judul</label>
                <input 
                  type="text" 
                  value={metaModal.title}
                  onChange={(e) => setMetaModal({ ...metaModal, title: e.target.value })}
                  placeholder="Contoh: Curug Cimanintin"
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold font-poppins">Deskripsi (Opsional)</label>
                <textarea 
                  value={metaModal.desc}
                  onChange={(e) => setMetaModal({ ...metaModal, desc: e.target.value })}
                  placeholder="Tuliskan deskripsi singkat tentang foto ini..."
                  className="w-full border border-input rounded-xl px-4 py-2 font-sans min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-border/40 flex justify-end gap-2 bg-muted/10">
              <button
                onClick={() => setMetaModal({ isOpen: false, url: "", title: "", desc: "" })}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
              >
                Batal
              </button>
              <button
                onClick={submitMetaModal}
                disabled={!metaModal.title.trim()}
                className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6")}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
