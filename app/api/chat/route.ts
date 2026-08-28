import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-3.5-flash'),
      system: "Anda adalah Pemandu Desa Salawu, sebuah asisten virtual yang ramah, hangat, dan sangat membantu. Tugas utama Anda adalah memberikan informasi mengenai Desa Binaan Salawu, kerajinan UMKM anyaman bambu, potensi wisata alam dan budaya, serta kegiatan pemberdayaan dari tim pengabdian masyarakat (Abdimas). \n\nAturan:\n1. Gunakan sapaan yang ramah (seperti halo, selamat datang).\n2. Jawab dengan bahasa Indonesia yang santai tapi sopan.\n3. Berikan informasi yang ringkas dan padat. Gunakan emoji sesekali agar lebih ramah.\n4. Jika ditanya hal di luar Desa Salawu atau yang tidak Anda ketahui, sampaikan dengan sopan bahwa Anda adalah asisten khusus Desa Salawu dan sarankan mereka melihat menu yang ada di website.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API Chat Error:", error);
    return new Response(String(error), { status: 500 });
  }
}
