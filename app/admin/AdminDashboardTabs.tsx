"use client";

import React, { useState } from "react";
import { PackageSearch, CalendarDays, Sparkles } from "lucide-react";
import AdminDashboardClient from "./AdminDashboardClient";
import AdminVisitClient from "./AdminVisitClient";
import AdminAiClient from "./AdminAiClient";
import AdminMediaClient from "./AdminMediaClient";
import AdminSettingsClient from "./AdminSettingsClient";
import AdminWebContentClient from "./AdminWebContentClient";
import { Product, Visit } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Settings, FileText } from "lucide-react";

interface Props {
  initialProducts: Product[];
  initialVisits: Visit[];
}

export default function AdminDashboardTabs({ initialProducts, initialVisits }: Props) {
  const [activeTab, setActiveTab] = useState<"products" | "visits" | "ai" | "media" | "settings" | "web-content">("products");

  return (
    <div className="space-y-6">
      {/* Custom Tab Navigation */}
      <div className="flex flex-col md:flex-row p-1 bg-muted/30 border border-border/40 rounded-2xl w-full max-w-4xl mx-auto mb-8 gap-1 md:gap-0">
        <button
          onClick={() => setActiveTab("products")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "products"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <PackageSearch className="h-4 w-4" /> Kelola Produk
        </button>
        <button
          onClick={() => setActiveTab("visits")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "visits"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <CalendarDays className="h-4 w-4" /> Kelola Kunjungan
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "media"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> Kelola Media
        </button>
        <button
          onClick={() => setActiveTab("web-content")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "web-content"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <FileText className="h-4 w-4" /> Konten Teks
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "settings"
              ? "bg-background text-foreground shadow-sm border border-border/50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Settings className="h-4 w-4" /> Pengaturan Kontak
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-poppins transition-all",
            activeTab === "ai"
              ? "bg-primary text-primary-foreground shadow-sm border border-primary/50 shadow-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Sparkles className="h-4 w-4" /> Asisten AI
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "products" && <AdminDashboardClient initialProducts={initialProducts} />}
        {activeTab === "visits" && <AdminVisitClient initialVisits={initialVisits} />}
        {activeTab === "media" && <AdminMediaClient />}
        {activeTab === "web-content" && <AdminWebContentClient />}
        {activeTab === "settings" && <AdminSettingsClient />}
        {activeTab === "ai" && <AdminAiClient products={initialProducts} />}
      </div>
    </div>
  );
}
