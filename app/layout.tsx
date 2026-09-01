import type { Metadata } from "next";
import { Inter, Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import Chatbot from "@/components/Chatbot";

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
  title: "Website Abdimas Desa Binaan Salawu",
  description:
    "Website resmi Desa Binaan Salawu sebagai media promosi UMKM, budaya, wisata, dan informasi desa.",
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
      name: "Tim Abdimas Desa Binaan Salawu",
    },
  ],
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
        {children}
        <Chatbot />
      </body>
    </html>
  );
}