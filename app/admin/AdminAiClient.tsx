"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Copy, Check, AlertTriangle, Loader2, ImagePlus, X } from "lucide-react";
import { Product } from "@/lib/db";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
}

export default function AdminAiClient({ products }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [contentType, setContentType] = useState<string>("ide");
  const [language, setLanguage] = useState<string>("id");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<{ text: string; missingKey?: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  // Multimodal state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) {
        setError({ text: "Ukuran foto maksimal 4MB." });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!selectedProductId && !imageFile) {
      setError({ text: "Pilih produk dari database atau unggah foto untuk dianalisis AI." });
      return;
    }

    const product = products.find(p => p.id === selectedProductId);

    setIsGenerating(true);
    setError(null);
    setResult("");
    setCopied(false);

    try {
      let base64Image = null;
      let mimeType = null;
      
      if (imageFile) {
        base64Image = await fileToBase64(imageFile);
        mimeType = imageFile.type;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productDetails: product || null,
          contentType,
          language,
          image: base64Image ? { data: base64Image, mimeType } : null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw { message: data.error, missingKey: data.missingKey };
      }

      setResult(data.result);
    } catch (err: any) {
      setError({ text: err.message || "Gagal menghubungi AI.", missingKey: err.missingKey });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-background border border-border/40 p-6 md:p-8 rounded-3xl shadow-sm">
        
        <div className="mb-8 border-b border-border/60 pb-6 flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-poppins text-foreground">Toolkit AI untuk Konten</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Buat materi promosi otomatis berdasarkan data produk atau analisis visual dari foto yang Anda unggah.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold font-poppins flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>
              <p>{error.text}</p>
              {error.missingKey && (
                <p className="mt-1 text-xs font-normal opacity-90">
                  Untuk menggunakan fitur ini, Anda harus menambahkan <code>GEMINI_API_KEY</code> di dalam file <code>.env.local</code> proyek ini dan me-restart server. Anda bisa mendapatkan kunci ini secara gratis di Google AI Studio.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground font-poppins uppercase tracking-wider">
              1. Pilih Produk (Opsional)
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 appearance-none font-medium"
            >
              <option value="">-- Tidak ada produk --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground font-poppins uppercase tracking-wider">
              2. Jenis Konten
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 appearance-none font-medium"
            >
              <option value="ide">💡 Ide Konten Promosi</option>
              <option value="caption">✍️ Caption & Copywriting</option>
              <option value="skrip">🎬 Skrip Video Pendek</option>
              <option value="faq">💬 Template FAQ Pelanggan</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground font-poppins uppercase tracking-wider">
              3. Bahasa Output
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 appearance-none font-medium"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">Bahasa Inggris (English)</option>
            </select>
          </div>
        </div>

        <div className="mb-8 space-y-2">
          <label className="text-xs font-bold text-muted-foreground font-poppins uppercase tracking-wider">
            4. Analisis Foto Visual (Opsional)
          </label>
          <div className={cn("border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-colors", imagePreview ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30")}>
            {imagePreview ? (
              <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 cursor-pointer">
                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-foreground">Unggah Foto Produk untuk dianalisis AI</span>
                <span className="text-xs text-muted-foreground mt-1">PNG, JPG, max 4MB</span>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!selectedProductId && !imageFile)}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-base font-semibold font-poppins py-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Sedang Menulis...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" /> Generate Konten Sekarang
            </>
          )}
        </button>

      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-background border border-primary/30 p-6 md:p-8 rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg font-poppins text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Hasil Buatan AI
            </h3>
            <button
              onClick={copyToClipboard}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer border",
                copied 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {copied ? <><Check className="h-4 w-4" /> Tersalin</> : <><Copy className="h-4 w-4" /> Salin Teks</>}
            </button>
          </div>
          
          <div className="bg-muted/20 p-5 rounded-2xl border border-border/50 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans">
            {result}
          </div>
        </div>
      )}

    </div>
  );
}
