import { NextResponse } from "next/server";
import { readdir, stat, writeFile, mkdir } from "fs/promises";
import path from "path";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

// Function to recursively get all files in a directory
async function getFilesRecursively(dir: string): Promise<string[]> {
  let results: string[] = [];
  try {
    const list = await readdir(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        const subFiles = await getFilesRecursively(filePath);
        results = results.concat(subFiles);
      } else {
        results.push(filePath);
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
  return results;
}

export async function GET() {
  try {
    const publicImagesDir = path.join(process.cwd(), "public", "images");
    const allFiles = await getFilesRecursively(publicImagesDir);

    // Filter only image and video files and map them to their public URL paths
    const mediaExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4", ".webm"];
    
    const imageUrls = allFiles
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return mediaExtensions.includes(ext);
      })
      .map((file) => {
        // Convert the absolute path back to a URL path relative to /public
        const relativePath = file.replace(path.join(process.cwd(), "public"), "");
        // Normalize backslashes to forward slashes for URLs
        return relativePath.replace(/\\/g, "/");
      });

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + "-" + file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");

    if (isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, `images/uploads/${filename}`);
        const metadata = { contentType: file.type || "image/jpeg" };
        await uploadBytes(storageRef, buffer, metadata);
        const downloadUrl = await getDownloadURL(storageRef);
        return NextResponse.json({ success: true, url: downloadUrl });
      } catch (fbErr) {
        console.error("Firebase Storage media upload error, fallback to local:", fbErr);
      }
    }

    // Save to public/images/uploads locally
    try {
      const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      const publicUrl = `/images/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsErr) {
      console.warn("Local filesystem write failed, falling back to Base64 Data URL:", fsErr);
    }

    // Fallback: Base64 Data URL
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error: any) {
    console.error("Failed to upload media:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload media" }, { status: 500 });
  }
}
