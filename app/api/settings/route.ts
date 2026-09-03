import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "data", "settings.json");

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

const defaultSettings = {
  instagram: "",
  facebook: "",
  tiktok: "",
  x_twitter: "",
  youtube: "",
  website: "",
  whatsapp: "",
  email: "",
  address: "",
  gmaps_link: "",
  hero_video_type: "none",
  hero_video_url: "",
  profil_sejarah: `<h3>Legenda Desa (Sasakala)</h3><p>Desa Salawu adalah desa lama yang dimekarkan, yang tadinya merupakan perpaduan antara Desa Malongpong dengan Desa Serang sekitar Tahun 1905, dan namanya diganti menjadi Desa Salawu. Pusat Pemerintahan Desa pun berpindah dari Malongpong ke Nanggorak (dekat sawah percontohan).</p><p>Untuk menentukan Pusat Pemerintah Desa dan Nama desa, para sepuh mengadakan Musyawarah (Berempug). Hasilnya, mereka sepakat untuk melarung (menghanyutkan) <strong>sapu pare di Sungai Ciwulan</strong> (tepatnya di Leuwi Salawu). Arus membawa sapu pare tersebut hingga berhenti di Beunghar blok Cisitu. Melihat hal tersebut, para sepuh sangat senang (<em>Bingah Amarwatasuta</em>) karena akhirnya menemukan tempat dan nama Desa yang sampai sekarang bernama <strong>Desa Salawu</strong>.</p>`,
  profil_demografi: `<p>Sebagian besar masyarakat di Desa Salawu bergerak di bidang <strong>Pertanian</strong> dan <strong>Produksi Anyaman & Olahan Makanan Ringan</strong>. Setiap dusun memiliki fokus penggerak ekonomi yang berbeda:</p><ul><li><strong>Cikiray I & Cikiray II</strong>: Fokus pada sektor Produksi Anyaman Bambu.</li><li><strong>Nanggerang</strong>: Fokus pada sektor Pertanian dan Produksi Olahan Makanan Ringan berbahan dasar Singkong ("Comring").</li><li><strong>Salawu I & Salawu II</strong>: Banyak didominasi oleh aktivitas Perdagangan.</li></ul>`,
  profil_budaya: `<p>Budaya dan Adat Istiadat yang diwariskan oleh para leluhur masih sangat dijaga dan dihormati oleh masyarakat Desa Salawu. Masyarakat masih kuat memegang nilai <strong>"Pamali"</strong> (hal-hal tabu yang dilarang) sebagai panduan keharmonisan hidup dengan alam dan sesama.</p><h3>Budaya "Nganyam"</h3><p>Daya tarik utama Desa Salawu yang membedakannya dengan desa lain di Jawa Barat adalah tradisi <strong>"Nganyam"</strong> (menganyam bambu) yang telah turun temurun.</p>`,
  profil_arsitektur: `<p>Bentuk bangunan rumah yang ada di Desa Salawu (khususnya Dusun Cikiray I) hampir menyerupai <strong>Bangunan Rumah Tradisional Kampung Naga</strong>. Struktur ini mengutamakan kearifan lokal menggunakan bahan alam sekitarnya seperti kayu, bambu, dan ijuk.</p><h3>Filosofi Rumah Panggung</h3><ul><li><strong>Lalangit / Para (Atas)</strong>: Langit-langit dari anyaman bambu.</li><li><strong>Palupuh (Tengah)</strong>: Lantai bangunan berupa belahan bambu atau papan kayu.</li><li><strong>Kolong Imah (Bawah)</strong>: Ruang hampa antara tanah dengan lantai rumah.</li></ul>`,
  profil_peninggalan: `<p>Desa Salawu menyimpan jejak spiritual serta kejeniusan teknologi tradisional yang beradaptasi sempurna dengan keindahan alam sekitarnya.</p><h3>Situs Keramat Leluhur</h3><ul><li><strong>Situs Gunung Masigit</strong> (Eyang Nur Banten) - Cikiray I</li><li><strong>Situs Gunung Karamat</strong> (Sembah Dalem Geger Cahaya) - Cikiray I</li><li><strong>Situs Sembah Raja</strong> - Dusun Cisudang</li><li><strong>Situs Jati</strong> (Eyang Sanggan Jati)</li></ul>`
};

function readLocalSettings() {
  if (!fs.existsSync(dataFilePath)) {
    return defaultSettings;
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContent);
  } catch {
    return defaultSettings;
  }
}

export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return NextResponse.json(docSnap.data());
        }
        const localData = readLocalSettings();
        await setDoc(docRef, localData);
        return NextResponse.json(localData);
      } catch (fbErr) {
        console.error("Firestore GET settings error, fallback:", fbErr);
      }
    }

    const data = readLocalSettings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read settings:", error);
    return NextResponse.json({ error: "Failed to read settings data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "general");
        await setDoc(docRef, data);
        return NextResponse.json({ success: true, data });
      } catch (fbErr) {
        console.error("Firestore POST settings error, fallback:", fbErr);
      }
    }
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save settings data" }, { status: 500 });
  }
}
