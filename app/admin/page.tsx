import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProducts, getVisits } from "@/lib/db";
import AdminDashboardTabs from "./AdminDashboardTabs";
import ChangePasswordModal from "./ChangePasswordModal";
import { ShieldAlert } from "lucide-react";
import { logout } from "../login/actions";

export const revalidate = 0;

export default async function AdminPage() {
  const products = await getProducts();
  const visits = await getVisits();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Header Title */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-border/60 pb-6 mb-10 gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-sm font-semibold text-primary tracking-wider uppercase font-poppins flex items-center justify-center md:justify-start gap-1.5">
                <ShieldAlert className="h-4 w-4 text-secondary" /> Pengelola Konten
              </span>
              <h1 className="text-3xl font-bold font-poppins text-foreground tracking-tight">
                Panel Administrasi Desa
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ChangePasswordModal />
              <form action={logout}>
                <button 
                  type="submit" 
                  className="bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 px-6 py-2.5 rounded-2xl text-sm font-bold font-poppins transition-colors cursor-pointer"
                >
                  Logout dari Admin
                </button>
              </form>
            </div>
          </div>

          {/* Admin Dashboard Tabs Wrapper */}
          <AdminDashboardTabs initialProducts={products} initialVisits={visits} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
