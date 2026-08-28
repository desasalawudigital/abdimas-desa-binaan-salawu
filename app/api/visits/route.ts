import { NextResponse } from "next/server";
import { getVisits, addVisit } from "@/lib/db";

export async function GET() {
  const visits = await getVisits();
  return NextResponse.json(visits);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: "Judul dan tanggal wajib diisi." },
        { status: 400 }
      );
    }

    const newVisit = await addVisit({
      title: body.title,
      date: body.date,
      desc: body.desc || "",
      imageEmoji: body.imageEmoji || "📸",
      imageUrl: body.imageUrl,
    });

    if (!newVisit) {
      return NextResponse.json(
        { error: "Gagal menyimpan data kunjungan." },
        { status: 500 }
      );
    }

    return NextResponse.json(newVisit, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Permintaan data tidak valid." },
      { status: 400 }
    );
  }
}
