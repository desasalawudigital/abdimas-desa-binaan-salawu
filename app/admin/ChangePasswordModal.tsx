"use client";

import React, { useState } from "react";
import { X, Lock, KeyRound } from "lucide-react";
import { changePassword } from "../login/actions";
import { cn } from "@/lib/utils";

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await changePassword(formData);
      
      if (res?.error) {
        setMessage({ text: res.error, type: "error" });
      } else if (res?.success) {
        setMessage({ text: res.success, type: "success" });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan sistem.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-6 py-2.5 rounded-2xl text-sm font-bold font-poppins transition-colors cursor-pointer flex items-center gap-2"
      >
        <KeyRound className="h-4 w-4" /> Ganti Password
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-border/60 rounded-3xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-4">
              <h2 className="text-xl font-bold font-poppins text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Ubah Password
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {message && (
              <div
                className={cn(
                  "p-4 rounded-xl text-xs font-semibold font-poppins border mb-6",
                  message.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Password Lama</label>
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Masukkan password lama"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground font-poppins">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary bg-muted/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm font-semibold font-poppins py-3 rounded-xl shadow-sm transition-all cursor-pointer mt-4"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
