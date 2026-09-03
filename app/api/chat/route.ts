import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSettings, getProducts } from '@/lib/db';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Fetch dynamic context
    let settingsData: any = {};
    let productsData: any[] = [];
    try {
      settingsData = await getSettings();
      productsData = await getProducts();
    } catch (e) {
      console.error("Gagal memuat konteks untuk AI:", e);
    }

    const contactInfo = `
    Kontak & Informasi Website:
    - Alamat: ${settingsData.address || "Desa Salawu, Kabupaten Tasikmalaya"}
    - Email: ${settingsData.email || "Belum tersedia"}
    - Telepon/WhatsApp: ${settingsData.phone || "Belum tersedia"}
    - Instagram: ${settingsData.instagram || "Belum tersedia"}
    - Facebook: ${settingsData.facebook || "Belum tersedia"}
    - Youtube: ${settingsData.youtube || "Belum tersedia"}
    `;

    const productsInfo = productsData.map(p => `- ${p.name} (Rp ${p.price?.toLocaleString('id-ID')}): ${p.desc}`).join("\n");

    const systemPrompt = `Anda adalah Pemandu Desa Salawu, sebuah asisten virtual yang ramah, hangat, dan sangat membantu. Tugas utama Anda adalah memberikan informasi mengenai Desa Binaan Salawu, kerajinan UMKM anyaman bambu, potensi wisata alam dan budaya, serta kegiatan pemberdayaan masyarakat Desa Salawu.

Informasi terkini tentang Desa Salawu:
${contactInfo}

Produk UMKM yang tersedia:
${productsInfo || "Belum ada produk yang ditambahkan."}

Aturan:
1. Gunakan sapaan yang ramah (seperti halo, selamat datang).
2. Jawab dengan bahasa Indonesia yang santai tapi sopan.
3. Berikan informasi yang ringkas dan padat. Gunakan emoji sesekali agar lebih ramah.
4. JIKA pengguna menanyakan tentang kontak, sosial media, atau alamat, berikan informasi dari data Kontak & Informasi di atas.
5. Jika ditanya hal di luar Desa Salawu atau yang tidak Anda ketahui, sampaikan dengan sopan bahwa Anda adalah asisten khusus Desa Salawu dan sarankan mereka melihat menu yang ada di website.`;

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
