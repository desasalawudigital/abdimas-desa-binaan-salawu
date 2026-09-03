import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSettings, getProducts, getVisits } from '@/lib/db';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Fetch dynamic context
    let settingsData: Record<string, string> = {};
    let productsData: any[] = [];
    let visitsData: any[] = [];
    try {
      settingsData = await getSettings();
      productsData = await getProducts();
      visitsData = await getVisits();
    } catch (e) {
      console.error("Gagal memuat konteks untuk AI:", e);
    }

    const contactInfo = `
    Kontak & Informasi Website:
    - Alamat: ${settingsData.address || "Desa Salawu, Kabupaten Tasikmalaya"}
    - Email: ${settingsData.email || "Belum tersedia"}
    - Telepon/WhatsApp: ${settingsData.whatsapp || "Belum tersedia"}
    - Instagram: ${settingsData.instagram || "Belum tersedia"}
    - Facebook: ${settingsData.facebook || "Belum tersedia"}
    - Youtube: ${settingsData.youtube || "Belum tersedia"}
    `;

    // Extract unique craftsmen count
    const uniqueCraftsmen = new Set(productsData.map(p => p.craftsman).filter(Boolean));
    const craftsmenCount = uniqueCraftsmen.size;
    const totalProducts = productsData.length;

    const productsInfo = productsData.map(p => `- ${p.name} (Rp ${p.price?.toLocaleString('id-ID')}): ${p.desc} | Stok: ${p.stock} | Pengrajin: ${p.craftsman} | Kontak Penjual/WA: ${p.waNumber}`).join("\n");
    const visitsInfo = visitsData.map(v => `- ${v.title} (${v.date}): ${v.desc}`).join("\n");

    const systemPrompt = `Anda adalah Pemandu Desa Salawu, sebuah asisten virtual yang ramah, hangat, dan sangat membantu. Tugas utama Anda adalah memberikan informasi mengenai Desa Binaan Salawu, kerajinan UMKM anyaman bambu, potensi wisata alam dan budaya, serta kegiatan pemberdayaan masyarakat Desa Salawu.

Informasi terkini tentang Desa Salawu:
${contactInfo}

Statistik UMKM:
- Jumlah Produk Tersedia: ${totalProducts} produk
- Jumlah Pengrajin Aktif: ${craftsmenCount} orang pengrajin

Daftar Produk UMKM secara lengkap:
${productsInfo || "Belum ada produk yang ditambahkan."}

Tempat / Kunjungan Wisata:
${visitsInfo || "Belum ada data kunjungan wisata."}

Aturan:
1. Gunakan sapaan yang ramah (seperti halo, selamat datang).
2. Jawab dengan bahasa Indonesia yang santai tapi sopan.
3. Berikan informasi yang ringkas dan padat. Gunakan emoji sesekali agar lebih ramah.
4. JIKA pengguna menanyakan tentang kontak, sosial media, atau alamat, berikan informasi dari data Kontak & Informasi di atas.
5. JIKA pengguna bertanya tentang produk, penjual, pengrajin, atau stok, jawablah dengan detail dari Daftar Produk UMKM di atas.
6. Jika ditanya hal di luar Desa Salawu atau yang tidak Anda ketahui, sampaikan dengan sopan bahwa Anda adalah asisten khusus Desa Salawu dan sarankan mereka melihat menu yang ada di website.
7. PENTING: JANGAN menggunakan format markdown (seperti **, *, #) dalam jawaban Anda. Gunakan teks biasa yang rapi dengan spasi/enter yang baik.`;

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API Chat Error:", error);
    return new Response(String(error), { status: 500 });
  }
}
