import { NextResponse } from "next/server";
import { getProducts, addProduct } from "@/lib/db";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Nama, harga, dan kategori produk wajib diisi." },
        { status: 400 }
      );
    }

    const newProduct = await addProduct({
      name: body.name,
      category: body.category,
      price: Number(body.price),
      desc: body.desc || "",
      emoji: body.emoji || "📦",
      imageUrl: body.imageUrl,
      stock: Number(body.stock) || 0,
      dimensions: body.dimensions || "",
      craftsman: body.craftsman || "",
      waNumber: body.waNumber || "6281234567890",
    });

    if (!newProduct) {
      return NextResponse.json(
        { error: "Gagal menyimpan produk baru." },
        { status: 500 }
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Permintaan data tidak valid." },
      { status: 400 }
    );
  }
}
