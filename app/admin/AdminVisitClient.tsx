"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, RefreshCw, MapPin } from "lucide-react";
import { Visit } from "@/lib/db";
import { cn } from "@/lib/utils";

interface Props {
  initialVisits: Visit[];
}

export default function AdminVisitClient({ initialVisits }: Props) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [imageEmoji, setImageEmoji] = useState("📸");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Load visit to edit
  const handleEditClick = (visit: Visit) => {
    setIsEditingId(visit.id);
    setTitle(visit.title);
    setDate(visit.date);
    setDesc(visit.desc);
    setImageEmoji(visit.imageEmoji || "📸");
    setImageUrl(visit.imageUrl || "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setIsEditingId(null);
    setTitle("");
    setDate("");
    setDesc("");
    setImageEmoji("📸");
    setImageUrl("");
    setImageFile(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      setMessage({ text: "Silakan isi Judul dan Tanggal kunjungan.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    let uploadedImageUrl = imageUrl;
    
    // Upload file if selected
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Gagal mengunggah foto.");
        uploadedImageUrl = uploadData.url;
      } catch (err: unknown) {
        setMessage({ text: err instanceof Error ? err.message : "Gagal mengunggah foto.", type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      title,
      date,
      desc,
      imageEmoji,
      imageUrl: uploadedImageUrl,
    };

    try {
      if (isEditingId) {
        // Update API
        const res = await fetch(`/api/visits/${isEditingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memperbarui kunjungan.");
        
        setVisits(visits.map((v) => (v.id === isEditingId ? data : v)));
        setMessage({ text: `Data kunjungan berhasil diperbarui!`, type: "success" });
      } else {
        // Add API
        const res = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal menambahkan kunjungan.");

        setVisits([...visits, data]);
        setMessage({ text: `Data kunjungan berhasil ditambahkan!`, type: "success" });
      }
      resetForm();
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : "Terjadi kesalahan koneksi server.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, visitTitle: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data kunjungan "${visitTitle}"?`)) return;

    try {
      const res = await fetch(`/api/visits/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus kunjungan.");
      }
      setVisits(visits.filter((v) => v.id !== id));
      setMessage({ text: `Kunjungan "${visitTitle}" berhasil dihapus.`, type: "success" });
      if (isEditingId === id) resetForm();
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : "Gagal melakukan penghapusan.", type: "error" });
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
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" /> Edit Kunjungan
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary" /> Tambah Kunjungan
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
              <label className="text-xs font-bold text-muted-foreground font-poppins">Judul Kunjungan</label>
              <input
                type="text"
                placeholder="Contoh: Sosialisasi Digitalisasi UMKM Tahap I"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Tanggal Kunjungan</label>
                <input
                  type="text"
                  placeholder="Contoh: 15 Juli 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Visual Emoji</label>
                <input
                  type="text"
                  placeholder="Contoh: 📸"
                  value={imageEmoji}
                  onChange={(e) => setImageEmoji(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-center focus:outline-none focus:border-primary bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground font-poppins">Foto Kunjungan (Opsional)</label>
              <div className="flex items-center gap-4 p-2 bg-muted/20 border border-border rounded-xl">
                 <input
                    type="file"
                    accept="image/*"
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
                      <img src={imageUrl} alt="Preview" className="h-full w-full object-cover rounded-md border border-border" />
                      <button type="button" onClick={() => { setImageFile(null); setImageUrl(""); }} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                    </div>
                  )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground font-poppins">Deskripsi Kegiatan</label>
              <textarea
                placeholder="Ceritakan kegiatan selama kunjungan..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground text-sm font-semibold font-poppins py-3 rounded-xl shadow-sm transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? "Menyimpan..." : isEditingId ? "Simpan Perubahan" : "Tambah Kunjungan"}
            </button>
          </form>
        </div>

        {/* List Table Panel */}
        <div className="lg:col-span-7 bg-background border border-border/40 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-border/60 p-6 flex justify-between items-center">
            <h2 className="font-bold text-lg font-poppins text-foreground">Daftar Riwayat Kunjungan</h2>
            <div className="bg-secondary/15 text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
              {visits.length} Kunjungan
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground font-poppins uppercase">
                <tr>
                  <th className="p-4 w-12 text-center">Visual</th>
                  <th className="p-4">Detail Kegiatan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {visits.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-muted-foreground text-xs">
                      Tidak ada data kunjungan.
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-center text-2xl">
                        {visit.imageUrl ? (
                           <img src={visit.imageUrl} alt={visit.title} className="h-12 w-12 object-cover rounded-lg mx-auto border border-border/50 shadow-sm" />
                        ) : (
                          visit.imageEmoji
                        )}
                      </td>
                      <td className="p-4 space-y-1">
                        <p className="font-bold text-foreground">{visit.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-3">
                          <span>{visit.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Desa Salawu</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(visit)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(visit.id, visit.title)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Data"
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
          </div>
        </div>
      </div>
    </div>
  );
}
