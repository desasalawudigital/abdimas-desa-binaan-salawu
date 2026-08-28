import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Typecast numeric fields if present
    const updatedFields: Record<string, unknown> = { ...body };
    if (body.price !== undefined) updatedFields.price = Number(body.price);
    if (body.stock !== undefined) updatedFields.stock = Number(body.stock);

    const updatedProduct = await updateProduct(id, updatedFields);
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Produk tidak ditemukan atau gagal diperbarui." }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json({ error: "Data masukan tidak valid." }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await deleteProduct(id);
  
  if (!success) {
    return NextResponse.json({ error: "Produk tidak ditemukan atau gagal dihapus." }, { status: 404 });
  }
  
  return NextResponse.json({ message: "Produk berhasil dihapus." });
}
