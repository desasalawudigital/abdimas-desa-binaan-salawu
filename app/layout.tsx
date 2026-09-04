import type { Metadata } from "next";
import { Inter, Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://desasalawudigital.vercel.app"),
  title: "Website Resmi Desa Binaan Salawu",
  description:
    "Website resmi Desa Binaan Salawu sebagai media promosi UMKM, budaya, wisata, dan informasi desa.",
  applicationName: "Desa Salawu",
  keywords: [
    "Desa Salawu",
    "UMKM",
    "Budaya",
    "Wisata",
    "Kerajinan",
    "Anyaman",
    "Aseupan",
  ],
  authors: [
    {
      name: "Pemerintah Desa Binaan Salawu",
    },
  ],
  openGraph: {
    title: "Website Resmi Desa Binaan Salawu",
    description: "Media promosi UMKM, budaya, wisata, dan informasi Desa Salawu.",
    url: "https://desasalawudigital.vercel.app",
    siteName: "Desa Salawu",
    locale: "id_ID",
    type: "website",
  },
  verification: {
    google: "ejHgt-z9H2hJZjcIVjDI8FeYNvPDN6oEcikWACPWCZs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(inter.variable, poppins.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
      </head>
      <body suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: "none" }}></div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'id',
                includedLanguages: 'en,id',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        {children}
        <Toaster position="top-center" richColors theme="light" />
        <Chatbot />
      </body>
    </html>
  );
}