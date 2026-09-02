import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    if (isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, `uploads/${filename}`);
        const metadata = { contentType: file.type || "image/jpeg" };
        await uploadBytes(storageRef, buffer, metadata);
        const downloadUrl = await getDownloadURL(storageRef);
        return NextResponse.json({ url: downloadUrl });
      } catch (fbErr) {
        console.error("Firebase Storage upload error, trying local storage or Base64 fallback:", fbErr);
      }
    }

    // Fallback 1: Try local filesystem upload directory (for localhost/standalone server)
    try {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ url: fileUrl });
    } catch (fsErr) {
      console.warn("Local filesystem write failed (read-only/serverless environment), falling back to Base64 Data URL:", fsErr);
    }

    // Fallback 2: Base64 Data URL so image upload NEVER fails even without storage permissions or writable disk
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ url: dataUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload file." }, { status: 500 });
  }
}
