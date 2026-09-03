import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productDetails, contentType, image, language } = await request.json();

    if (!productDetails && !image) {
      return NextResponse.json({ error: "Data produk atau gambar harus diisi." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY belum diatur.", 
        missingKey: true 
      }, { status: 401 });
    }

    let prompt = "";
    let context = `Kamu adalah seorang asisten AI pemasaran ahli untuk produk UMKM dari Desa Salawu. \n`;
    
    if (productDetails) {
      context += `Detail Produk yang sedang dipasarkan:
- Nama Produk: ${productDetails.name}
- Deskripsi: ${productDetails.desc}
- Ukuran: ${productDetails.dimensions}
- Pengrajin: ${productDetails.craftsman}\n`;
    }

    if (image) {
      context += `(Ada sebuah foto yang disertakan, mohon analisis visual dari foto tersebut untuk memperkaya deskripsi atau ide yang dihasilkan).\n`;
    }

    const langInstruction = language === "en" ? "TULIS HASILNYA DALAM BAHASA INGGRIS AMERIKA (US ENGLISH) YANG PROFESIONAL." : "TULIS HASILNYA DALAM BAHASA INDONESIA YANG MENARIK.";

    if (contentType === "deskripsi") {
      prompt = `${context}\nTugas: Buatkan sebuah deskripsi produk yang lengkap, menarik, persuasif, dan SEO-friendly untuk produk ini. Jelaskan manfaatnya, keunikannya, dan dorong pembaca untuk membeli.\n\n${langInstruction}`;
    } else if (contentType === "ide") {
      prompt = `${context}\nTugas: Berikan 3 ide konten promosi yang menarik dan kreatif (misalnya untuk Instagram Reels atau TikTok) untuk produk ini. Jelaskan secara singkat konsep videonya.\n\n${langInstruction}`;
    } else if (contentType === "caption") {
      prompt = `${context}\nTugas: Buatkan 1 caption Instagram yang menarik (copywriting yang memikat), sertakan Call-to-Action (CTA) untuk membeli, dan beberapa hashtag relevan.\n\n${langInstruction}`;
    } else if (contentType === "skrip") {
      prompt = `${context}\nTugas: Buatkan skrip video pendek (durasi 15-30 detik) bergaya TikTok/Reels untuk mempromosikan produk ini. Bagi menjadi bagian Visual (apa yang terlihat di layar) dan Audio (apa yang diucapkan/voice over).\n\n${langInstruction}`;
    } else if (contentType === "faq") {
      prompt = `${context}\nTugas: Buatkan 3-5 template FAQ (Pertanyaan yang Sering Diajukan) pelanggan beserta jawabannya yang ramah dan jelas mengenai produk ini.\n\n${langInstruction}`;
    } else {
      return NextResponse.json({ error: "Tipe konten tidak valid." }, { status: 400 });
    }

    const parts: Array<{ text?: string, inlineData?: { data: string, mimeType: string } }> = [{ text: prompt }];

    if (image && image.data && image.mimeType) {
      parts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType
        }
      });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts
          }
        ]
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({ error: "Gagal menghasilkan konten dari AI." }, { status: 500 });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return NextResponse.json({ error: "AI tidak mengembalikan respon yang valid." }, { status: 500 });
    }

    return NextResponse.json({ result: generatedText });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
