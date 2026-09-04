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
    const formatInstruction = "PENTING: JANGAN MENGGUNAKAN SIMBOL MARKDOWN APAPUN (seperti **, *, #, atau ---) dalam hasil tulisanmu. Gunakan teks biasa (plain text), huruf kapital untuk judul/penekanan, dan spasi/baris baru yang rapi saja.";

    if (contentType === "deskripsi") {
      prompt = `${context}\nTugas: Buatkan sebuah deskripsi produk yang lengkap, menarik, persuasif, dan SEO-friendly untuk produk ini. Jelaskan manfaatnya, keunikannya, dan dorong pembaca untuk membeli.\n\n${langInstruction}\n${formatInstruction}`;
    } else if (contentType === "ide") {
      prompt = `${context}\nTugas: Berikan 3 ide konten promosi yang menarik dan kreatif (misalnya untuk Instagram Reels atau TikTok) untuk produk ini. Jelaskan secara singkat konsep videonya.\n\n${langInstruction}\n${formatInstruction}`;
    } else if (contentType === "caption") {
      prompt = `${context}\nTugas: Buatkan 1 caption Instagram yang menarik (copywriting yang memikat), sertakan Call-to-Action (CTA) untuk membeli, dan beberapa hashtag relevan.\n\n${langInstruction}\n${formatInstruction}`;
    } else if (contentType === "skrip") {
      prompt = `${context}\nTugas: Buatkan skrip video pendek (durasi 15-30 detik) bergaya TikTok/Reels untuk mempromosikan produk ini. Bagi menjadi bagian Visual (apa yang terlihat di layar) dan Audio (apa yang diucapkan/voice over).\n\n${langInstruction}\n${formatInstruction}`;
    } else if (contentType === "faq") {
      prompt = `${context}\nTugas: Buatkan 3-5 template FAQ (Pertanyaan yang Sering Diajukan) pelanggan beserta jawabannya yang ramah dan jelas mengenai produk ini.\n\n${langInstruction}\n${formatInstruction}`;
    } else {
      return NextResponse.json({ error: "Tipe konten tidak valid." }, { status: 400 });
    }

    const parts: Array<{ text?: string, inline_data?: { data: string, mime_type: string } }> = [{ text: prompt }];

    if (image && image.data && image.mimeType) {
      parts.push({
        inline_data: {
          data: image.data,
          mime_type: image.mimeType
        }
      });
    }

    const requestBody = JSON.stringify({
      contents: [
        {
          parts: parts
        }
      ]
    });

    let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    let data = await res.json();

    // Fallback to pro model if flash is overloaded or quota exceeded
    if (!res.ok && (res.status === 503 || res.status === 429 || data.error?.message?.includes("high demand"))) {
      console.log("Gemini Flash overloaded/quota hit. Falling back to Gemini Pro.");
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      data = await res.json();
    }

    if (!res.ok) {
      console.error("Gemini API Error:", data);
      
      let errorMessage = data.error?.message || "Gagal menghasilkan konten dari AI.";
      if (errorMessage.includes("high demand") || res.status === 503) {
        errorMessage = "Server AI Google saat ini sedang penuh/sibuk karena tingginya permintaan global. Mohon tunggu beberapa saat dan coba lagi.";
      } else if (res.status === 429) {
        errorMessage = "Kuota API harian Anda telah habis atau Anda melakukan terlalu banyak permintaan dalam waktu singkat. Silakan coba lagi besok atau gunakan API key baru.";
      }

      return NextResponse.json({ error: errorMessage }, { status: res.status });
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
