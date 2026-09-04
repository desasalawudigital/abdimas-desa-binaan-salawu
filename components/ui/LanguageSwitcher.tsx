"use client";

import { useEffect, useState, useRef } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<"id" | "en">("id");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check current language from cookie
    const checkCookie = () => {
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf("googtrans=") === 0) {
          const val = c.substring("googtrans=".length, c.length);
          if (val === "/id/en" || val === "/en/en") {
            setLang("en");
            return;
          }
        }
      }
      setLang("id");
    };
    
    checkCookie();

    // Handle outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchLanguage = (newLang: "id" | "en") => {
    setIsOpen(false);
    if (newLang === lang) return;

    if (newLang === "en") {
      // Set to English
      document.cookie = "googtrans=/id/en; path=/";
      // Also set for domain if possible to ensure it catches everywhere
      document.cookie = `googtrans=/id/en; domain=${window.location.hostname}; path=/`;
    } else {
      // Set back to default (Indonesian)
      document.cookie = "googtrans=/id/id; path=/";
      document.cookie = `googtrans=/id/id; domain=${window.location.hostname}; path=/`;
      // Clear cookie as well
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    }
    
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
        aria-label="Ubah Bahasa"
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">{lang === "id" ? "ID" : "EN"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            <button
              onClick={() => switchLanguage("id")}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                lang === "id" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              🇮🇩 Indonesia
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                lang === "en" 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              🇺🇸 English (US)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
