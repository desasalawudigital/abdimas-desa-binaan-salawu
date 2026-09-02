"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, RefreshCw, Layers, Users, Box } from "lucide-react";
import { Product } from "@/lib/db";
import { cn } from "@/lib/utils";
import { compressImage, safeFetchJson } from "@/lib/image-compression";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Props {
  initialProducts: Product[];
}

export default function AdminDashboardClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"dapur" | "dekorasi" | "fashion" | "makanan" | "minuman">("dapur");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [stock, setStock] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [craftsman, setCraftsman] = useState("");
  const [waNumber, setWaNumber] = useState("6281234567890");

  // Summary Metrics
  const metrics = useMemo(() => {
    const uniqueCraftsmen = new Set(products.map((p) => p.craftsman.trim().toLowerCase())).size;
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    return {
      totalProducts: products.length,
      totalCraftsmen: uniqueCraftsmen,
      totalStock: totalStock,
    };
  }, [products]);

  // Load product to edit
  const handleEditClick = (product: Product) => {
    setIsEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setDesc(product.desc);
    setEmoji(product.emoji);
    setImageUrl(product.imageUrl || "");
    setImageFile(null);
    setStock(product.stock.toString());
    setDimensions(product.dimensions);
    setCraftsman(product.craftsman);
    setWaNumber(product.waNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setIsEditingId(null);
    setName("");
    setCategory("dapur");
    setPrice("");
    setDesc("");
    setEmoji("📦");
    setImageUrl("");
    setImageFile(null);
    setStock("");
    setDimensions("");
    setCraftsman("");
    setWaNumber("6281234567890");
  };

  // Submit Handler: Add or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !craftsman) {
      setMessage({ text: "Silakan isi kolom Nama, Kategori, Harga, dan Pengrajin.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    let uploadedImageUrl = imageUrl;
    
    // Upload file if selected
    if (imageFile) {
      try {
        const fileToUpload = await compressImage(imageFile);
        
        const filename = `${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `uploads/${filename}`);
        const metadata = { contentType: fileToUpload.type || "image/jpeg" };
        
        await uploadBytes(storageRef, fileToUpload, metadata);
        uploadedImageUrl = await getDownloadURL(storageRef);
      } catch (err: any) {
        setMessage({ text: err.message || "Gagal mengunggah foto ke Firebase.", type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      name,
      category,
      price: Number(price),
      desc,
      emoji,
      imageUrl: uploadedImageUrl,
      stock: Number(stock) || 0,
      dimensions,
      craftsman,
      waNumber,
    };

    try {
      if (isEditingId) {
        // Update API
        const result = await safeFetchJson<Product>(`/api/products/${isEditingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!result.ok || !result.data) throw new Error(result.error || "Gagal memperbarui produk.");
        
        const data = result.data;
        setProducts(products.map((p) => (p.id === isEditingId ? data : p)));
        setMessage({ text: `Produk "${name}" berhasil diperbarui!`, type: "success" });
      } else {
        // Add API
        const result = await safeFetchJson<Product>("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!result.ok || !result.data) throw new Error(result.error || "Gagal menambahkan produk.");

        const data = result.data;
        setProducts([...products, data]);
        setMessage({ text: `Produk "${name}" berhasil ditambahkan!`, type: "success" });
      }
      resetForm();
    } catch (err: any) {
      setMessage({ text: err.message || "Terjadi kesalahan koneksi server.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${productName}" dari database?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus produk.");
      }
      setProducts(products.filter((p) => p.id !== id));
      setMessage({ text: `Produk "${productName}" berhasil dihapus.`, type: "success" });
      if (isEditingId === id) resetForm();
    } catch (err: any) {
      setMessage({ text: err.message || "Gagal melakukan penghapusan.", type: "error" });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-10">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background border border-border/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Jenis Produk</p>
            <p className="text-2xl font-bold font-poppins text-foreground">{metrics.totalProducts}</p>
          </div>
        </div>
        <div className="bg-background border border-border/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-secondary/15 rounded-2xl text-secondary-foreground">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Pengrajin Binaan</p>
            <p className="text-2xl font-bold font-poppins text-foreground">{metrics.totalCraftsmen}</p>
          </div>
        </div>
        <div className="bg-background border border-border/50 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Box className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Stok Inventori</p>
            <p className="text-2xl font-bold font-poppins text-foreground">{metrics.totalStock} unit</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-background border border-border/40 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="font-bold text-lg font-poppins text-foreground flex items-center gap-2">
              {isEditingId ? (
                <>
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" /> Edit Data Produk
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary" /> Tambah Produk Baru
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
              <label className="text-xs font-bold text-muted-foreground font-poppins">Nama Produk</label>
              <input
                type="text"
                placeholder="Contoh: Aseupan Bambu Sedang"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 cursor-pointer"
                >
                  <option value="dapur">Peralatan Dapur</option>
                  <option value="dekorasi">Dekorasi Ruang</option>
                  <option value="fashion">Fashion</option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 35000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Visual Emoji</label>
                <input
                  type="text"
                  placeholder="Contoh: 🏺"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-center focus:outline-none focus:border-primary bg-muted/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Stok Awal</label>
                <input
                  type="number"
                  placeholder="Contoh: 30"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground font-poppins">Foto Produk Asli (Opsional)</label>
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
              <label className="text-xs font-bold text-muted-foreground font-poppins">Ukuran / Dimensi</label>
              <input
                type="text"
                placeholder="Contoh: Diameter 30cm, Tinggi 35cm"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Nama Pengrajin</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Cecep"
                  value={craftsman}
                  onChange={(e) => setCraftsman(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">No. WA Pengrajin</label>
                <input
                  type="text"
                  placeholder="Contoh: 6281234567890"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground font-poppins">Deskripsi Produk</label>
              <textarea
                placeholder="Ceritakan detail keunikan produk..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-primary-foreground text-sm font-semibold font-poppins py-3 rounded-xl shadow-sm transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? "Menyimpan..." : isEditingId ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </form>
        </div>

        {/* List Table Panel */}
        <div className="lg:col-span-7 bg-background border border-border/40 rounded-3xl shadow-sm overflow-hidden">
          <div className="border-b border-border/60 p-6">
            <h2 className="font-bold text-lg font-poppins text-foreground">Daftar Produk Terdaftar</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border/60 text-xs text-muted-foreground font-poppins uppercase">
                <tr>
                  <th className="p-4 w-12 text-center">Visual</th>
                  <th className="p-4">Nama & Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Pengrajin</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                      Tidak ada produk dalam database.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-center text-2xl">
                        {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover rounded-lg mx-auto border border-border/50 shadow-sm" />
                        ) : (
                          product.emoji
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-foreground">{product.name}</p>
                        <span className="text-[10px] bg-primary/5 text-primary font-semibold font-poppins px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-primary">
                        {formatPrice(product.price)}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {product.craftsman}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Produk"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Produk"
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
