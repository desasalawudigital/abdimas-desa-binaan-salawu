"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Globe, ExternalLink } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
    width="24"
    height="24"
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
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267l-11.733-16z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const [settings, setSettings] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
    x_twitter: "",
    youtube: "",
    website: "",
    whatsapp: "",
    email: "",
    address: "",
    gmaps_link: ""
  });

  useEffect(() => {
    const loadSettings = () => {
      fetch(`/api/settings?t=${new Date().getTime()}`, { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setSettings(data);
          }
        })
        .catch(err => console.error("Failed to load settings:", err));
    };

    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  return (
    <footer id="kontak" className="bg-foreground text-background pt-16 pb-8 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-2xl font-bold font-poppins text-background">
                Desa<span className="text-secondary">Salawu</span>
              </span>
              <p className="text-background/70 text-sm leading-relaxed">
                Website resmi Desa Salawu. Media publikasi hasil kegiatan wisata lokal, promosi produk unggulan UMKM kerajinan bambu, dan pesona wisata budaya lokal.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="Instagram">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="Facebook">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="TikTok">
                  <TiktokIcon className="h-4 w-4" />
                </a>
              )}
              {settings.x_twitter && (
                <a href={settings.x_twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="X (Twitter)">
                  <XIcon className="h-4 w-4" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="YouTube">
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              )}
              {settings.website && (
                <a href={settings.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-background/5 hover:bg-primary hover:text-white transition-colors rounded-full" aria-label="Website">
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-6 text-background">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  Tentang Salawu
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  Katalog UMKM
                </Link>
              </li>
              <li>
                <Link href="/kunjungan" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  Wisata & Budaya
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-6 text-background">Kontak & Informasi</h3>
            <ul className="space-y-4">
              {settings.address && (
                <li className="flex items-start space-x-3 text-sm">
                  <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-background/70">
                    {settings.address}
                  </span>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-secondary shrink-0" />
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-background/70 hover:text-white transition-colors"
                  >
                    {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-secondary shrink-0" />
                  <span className="text-background/70">{settings.email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Map / Location Highlight */}
          <div>
            <h3 className="text-lg font-semibold font-poppins mb-6 text-background">Lokasi Desa</h3>
            <div className="rounded-lg overflow-hidden border border-background/10 bg-background/5 p-1 h-36 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex flex-col justify-end p-3 opacity-90 transition-opacity group-hover:opacity-100">
                <span className="text-xs text-white font-medium">Salawu, Tasikmalaya</span>
                <span className="text-[10px] text-white/70 flex items-center gap-0.5">
                  Buka di Google Maps <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </div>
              {/* Mock Map Background pattern using tailwind colors */}
              <div className="w-full h-full bg-slate-800 relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-950/20 blur-xl"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-[2px] bg-slate-700/60 transform rotate-12"></div>
                <div className="absolute top-1/3 left-1/2 w-[2px] h-20 bg-slate-700/60 transform -rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                <MapPin className="h-6 w-6 text-secondary relative z-10 animate-bounce" />
              </div>
              {settings.gmaps_link && (
                <a 
                  href={settings.gmaps_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="absolute inset-0 z-20"
                  aria-label="Google Maps"
                />
              )}
            </div>
          </div>

        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-background/50 gap-4">
          <p>© {new Date().getFullYear()} Abdimas Desa Binaan Salawu. All rights reserved.</p>
          
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-background transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-background transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
