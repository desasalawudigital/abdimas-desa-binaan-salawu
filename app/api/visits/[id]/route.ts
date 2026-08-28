import { NextResponse } from "next/server";
import { getVisitById, updateVisit, deleteVisit } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const visit = await getVisitById(id);
  
  if (!visit) {
    return NextResponse.json({ error: "Data kunjungan tidak ditemukan." }, { status: 404 });
  }
  
  return NextResponse.json(visit);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    const updatedFields: Record<string, unknown> = { ...body };

    const updatedVisit = await updateVisit(id, updatedFields);
    
    if (!updatedVisit) {
      return NextResponse.json({ error: "Data tidak ditemukan atau gagal diperbarui." }, { status: 404 });
    }
    
    return NextResponse.json(updatedVisit);
  } catch {
    return NextResponse.json({ error: "Data masukan tidak valid." }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await deleteVisit(id);
  
  if (!success) {
    return NextResponse.json({ error: "Data tidak ditemukan atau gagal dihapus." }, { status: 404 });
  }
  
  return NextResponse.json({ message: "Data kunjungan berhasil dihapus." });
}
