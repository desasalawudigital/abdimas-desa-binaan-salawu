"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, X, RefreshCw, Image as ImageIcon, Video, Link2 } from "lucide-react";
import { compressImage } from "@/lib/image-compression";
import { cn } from "@/lib/utils";

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

type MediaCategory = "seni_anyaman" | "alam_budaya" | "hero_image" | "hero_video";

interface UIMediaItem {
  id: string;
  category: MediaCategory;
  url: string;
  title: string;
  desc: string;
  videoType?: "none" | "youtube" | "local";
}

export default function AdminMediaClient() {
  const [galleries, setGalleries] = useState<GalleriesData>({ seni_anyaman: [], alam_budaya: [], hero_image: null });
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({ hero_video_type: "none", hero_video_url: "" });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<MediaCategory>("seni_anyaman");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  
  const [videoType, setVideoType] = useState<"youtube" | "local">("local");
  const [videoUrl, setVideoUrl] = useState("");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [galleriesRes, settingsRes] = await Promise.all([
        fetch("/api/galleries"),
        fetch("/api/settings")
      ]);
      
      if (galleriesRes.ok) {
        const data = await galleriesRes.json();
        setGalleries({
          seni_anyaman: data.seni_anyaman || [],
          alam_budaya: data.alam_budaya || [],
          hero_image: data.hero_image || null
        });
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setVideoSettings({
          hero_video_type: settingsData.hero_video_type || "none",
          hero_video_url: settingsData.hero_video_url || ""
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveGalleries = async (newGalleries: GalleriesData) => {
    const res = await fetch("/api/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGalleries)
    });
    if (!res.ok) throw new Error("Gagal menyimpan galeri");
    setGalleries(newGalleries);
  };

  const saveVideoSettings = async (newSettings: VideoSettings) => {
    const currentRes = await fetch("/api/settings");
    let currentSettings = {};
    if (currentRes.ok) currentSettings = await currentRes.json();
    
    const mergedSettings = { ...currentSettings, ...newSettings };
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mergedSettings)
    });
    
    if (!res.ok) throw new Error("Gagal menyimpan pengaturan video");
    setVideoSettings(newSettings);
    window.dispatchEvent(new Event('settingsUpdated'));
  };

  // Convert raw data to Unified List
  const mediaList = useMemo(() => {
    const list: UIMediaItem[] = [];
    
    galleries.seni_anyaman.forEach((url, idx) => {
      list.push({ id: `seni_anyaman_${idx}`, category: "seni_anyaman", url, title: `Seni Anyaman ${idx + 1}`, desc: "" });
    });
    
    galleries.alam_budaya.forEach((item, idx) => {
      list.push({ id: `alam_budaya_${idx}`, category: "alam_budaya", url: item.url, title: item.title, desc: item.desc });
    });

    if (galleries.hero_image) {
      list.push({ id: "hero_image", category: "hero_image", url: galleries.hero_image.url, title: galleries.hero_image.title, desc: galleries.hero_image.desc });
    }

    if (videoSettings.hero_video_type !== "none") {
      list.push({ id: "hero_video", category: "hero_video", url: videoSettings.hero_video_url, title: "Video Beranda", desc: "", videoType: videoSettings.hero_video_type });
    }

    return list;
  }, [galleries, videoSettings]);

  const handleEditClick = (item: UIMediaItem) => {
    setIsEditingId(item.id);
    setCategory(item.category);
    setTitle(item.title);
    setDesc(item.desc);
    setImageUrl(item.url);
    setImageFile(null);
    if (item.category === "hero_video") {
       setVideoType(item.videoType === "youtube" ? "youtube" : "local");
       if (item.videoType === "youtube") {
          setVideoUrl(item.url);
       }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditingId(null);
    setTitle("");
    setDesc("");
    setImageFile(null);
    setImageUrl("");
    setVideoUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let uploadedUrl = imageUrl;

      // Cloudinary Upload Logic (only if a file is selected)
      if (imageFile && (category !== "hero_video" || videoType === "local")) {
        const formData = new FormData();
        
        // compress if image
        if (imageFile.type.startsWith("image/")) {
           const fileToUpload = await compressImage(imageFile);
           formData.append("file", fileToUpload);
        } else {
           formData.append("file", imageFile);
        }
        
        formData.append("upload_preset", "abdimas_desa");

        // Use auto/upload for both image and video
        const res = await fetch("https://api.cloudinary.com/v1_1/nyc6iwek/auto/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error?.message || "Gagal mengunggah file media.");
        }

        const data = await res.json();
        uploadedUrl = data.secure_url;
      } else if (category === "hero_video" && videoType === "youtube") {
         uploadedUrl = videoUrl;
      }

      if (!uploadedUrl) {
         throw new Error("Pilih atau unggah file media terlebih dahulu.");
      }

      if (category === "hero_video") {
        const newSettings = { 
           hero_video_type: videoType, 
           hero_video_url: uploadedUrl 
        };
        await saveVideoSettings(newSettings);
        setMessage({ text: "Latar Belakang Video berhasil disimpan!", type: "success" });
      } else {
        const newGalleries = { ...galleries };
        
        if (category === "hero_image") {
          newGalleries.hero_image = { url: uploadedUrl, title: title || "Foto Utama Beranda", desc };
        } else if (category === "seni_anyaman") {
          if (isEditingId && isEditingId.startsWith("seni_anyaman_")) {
             const idx = parseInt(isEditingId.replace("seni_anyaman_", ""));
             newGalleries.seni_anyaman[idx] = uploadedUrl;
          } else {
             newGalleries.seni_anyaman.push(uploadedUrl);
          }
        } else if (category === "alam_budaya") {
          const itemMeta = { url: uploadedUrl, title: title || "Foto Alam & Budaya", desc };
          if (isEditingId && isEditingId.startsWith("alam_budaya_")) {
             const idx = parseInt(isEditingId.replace("alam_budaya_", ""));
             newGalleries.alam_budaya[idx] = itemMeta;
          } else {
             newGalleries.alam_budaya.push(itemMeta);
          }
        }

        await saveGalleries(newGalleries);
        setMessage({ text: "Media berhasil disimpan!", type: "success" });
      }
      
      resetForm();
    } catch (err: any) {
      setMessage({ text: err.message || "Gagal menyimpan media.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: UIMediaItem) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus media ini?`)) return;

    try {
      if (item.category === "hero_video") {
        await saveVideoSettings({ hero_video_type: "none", hero_video_url: "" });
      } else {
        const newGalleries = { ...galleries };
        
        if (item.category === "hero_image") {
          newGalleries.hero_image = null;
        } else if (item.category === "seni_anyaman") {
          const idx = parseInt(item.id.replace("seni_anyaman_", ""));
          newGalleries.seni_anyaman.splice(idx, 1);
        } else if (item.category === "alam_budaya") {
          const idx = parseInt(item.id.replace("alam_budaya_", ""));
          newGalleries.alam_budaya.splice(idx, 1);
        }
        
        await saveGalleries(newGalleries);
      }
      setMessage({ text: "Media berhasil dihapus.", type: "success" });
      if (isEditingId === item.id) resetForm();
    } catch (err: any) {
      setMessage({ text: "Gagal menghapus media.", type: "error" });
    }
  };

  const getCategoryLabel = (cat: MediaCategory) => {
    switch (cat) {
      case "seni_anyaman": return "Seni Anyaman";
      case "alam_budaya": return "Alam & Budaya";
      case "hero_image": return "Foto Utama (Beranda)";
      case "hero_video": return "Video Latar Belakang";
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-background border border-border/40 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="font-bold text-lg font-poppins text-foreground flex items-center gap-2">
              {isEditingId ? (
                <>
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" /> Edit Media
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary" /> Tambah Media
                </>
              )}
            </h2>
            {isEditingId && (
              <button
                onClick={resetForm}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Batalkan edit"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={cn(
                "p-4 rounded-2xl text-xs font-semibold font-poppins border",
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              )}
            >
              {message.text}
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground font-poppins">Kategori Media</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as MediaCategory);
                  if (e.target.value === "hero_video") {
                    setVideoType("local");
                  }
                }}
                disabled={!!isEditingId} // Don't allow changing category while editing
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 cursor-pointer disabled:opacity-50"
              >
                <option value="seni_anyaman">Galeri Seni Anyaman</option>
                <option value="alam_budaya">Alam & Budaya</option>
                <option value="hero_image">Foto Utama Beranda</option>
                <option value="hero_video">Latar Belakang Video (Hero)</option>
              </select>
            </div>

            {category === "hero_video" && (
              <div className="space-y-3">
                 <label className="text-xs font-bold text-muted-foreground font-poppins">Tipe Video</label>
                 <div className="flex gap-2">
                   <button
                     type="button"
                     onClick={() => setVideoType("local")}
                     className={cn("flex-1 px-4 py-2 text-sm font-semibold rounded-xl border transition-all", videoType === "local" ? "bg-primary text-white border-primary" : "border-border/50 text-muted-foreground hover:border-primary/50")}
                   >
                     <Video className="w-4 h-4 inline-block mr-2"/> File Lokal
                   </button>
                   <button
                     type="button"
                     onClick={() => setVideoType("youtube")}
                     className={cn("flex-1 px-4 py-2 text-sm font-semibold rounded-xl border transition-all", videoType === "youtube" ? "bg-red-600 text-white border-red-600" : "border-border/50 text-muted-foreground hover:border-primary/50")}
                   >
                     <Link2 className="w-4 h-4 inline-block mr-2"/> YouTube
                   </button>
                 </div>
              </div>
            )}

            {(category !== "hero_video" || videoType === "local") && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Unggah File (Media)</label>
                <div className="flex items-center gap-4 p-2 bg-muted/20 border border-border rounded-xl">
                   <input
                      type="file"
                      accept={category === "hero_video" ? "video/mp4,video/webm" : "image/*"}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                          setImageUrl(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {imageUrl && (
                      <div className="relative h-12 w-12 flex-shrink-0">
                        {category === "hero_video" ? (
                          <video src={imageUrl} className="h-full w-full object-cover rounded-md border border-border" />
                        ) : (
                          <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-md border border-border" />
                        )}
                        <button type="button" onClick={() => { setImageFile(null); setImageUrl(""); }} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                      </div>
                    )}
                </div>
              </div>
            )}

            {category === "hero_video" && videoType === "youtube" && (
               <div className="space-y-1">
                 <label className="text-xs font-bold text-muted-foreground font-poppins">URL YouTube</label>
                 <input
                   type="url"
                   placeholder="https://www.youtube.com/watch?v=..."
                   value={videoUrl}
                   onChange={(e) => setVideoUrl(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                   required
                 />
               </div>
            )}

            {(category === "alam_budaya" || category === "hero_image") && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground font-poppins">Judul Media</label>
                  <input
                    type="text"
                    placeholder="Contoh: Curug Cimanintin"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground font-poppins">Deskripsi (Opsional)</label>
                  <textarea
                    placeholder="Tuliskan deskripsi singkat..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground text-sm font-semibold font-poppins py-3 rounded-xl shadow-sm transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? "Menyimpan..." : isEditingId ? "Simpan Perubahan" : "Tambah Media"}
            </button>
          </form>
        </div>

        {/* List Table Panel */}
        <div className="lg:col-span-7 bg-background border border-border/40 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-border/60 p-6 flex justify-between items-center">
            <h2 className="font-bold text-lg font-poppins text-foreground">Daftar Media</h2>
            <div className="bg-secondary/15 text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
              {mediaList.length} Item
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
               <div className="p-10 flex justify-center"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground font-poppins uppercase">
                  <tr>
                    <th className="p-4 w-12 text-center">Visual</th>
                    <th className="p-4">Detail Media</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-sans">
                  {mediaList.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10 text-muted-foreground text-xs">
                        Tidak ada media.
                      </td>
                    </tr>
                  ) : (
                    mediaList.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 text-center">
                           {item.category === "hero_video" && item.videoType === "youtube" ? (
                             <div className="h-12 w-12 mx-auto bg-red-100 flex items-center justify-center rounded-lg border border-border/50">
                               <Link2 className="h-5 w-5 text-red-600" />
                             </div>
                           ) : item.category === "hero_video" ? (
                             <video src={item.url} className="h-12 w-12 object-cover rounded-lg mx-auto border border-border/50 shadow-sm" />
                           ) : (
                             <img src={item.url} alt={item.title} className="h-12 w-12 object-cover rounded-lg mx-auto border border-border/50 shadow-sm" />
                           )}
                        </td>
                        <td className="p-4 space-y-1">
                          <p className="font-bold text-foreground line-clamp-1">{item.title}</p>
                          <span className="text-[10px] bg-primary/5 text-primary font-semibold font-poppins px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                              title="Edit Media"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Media"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
