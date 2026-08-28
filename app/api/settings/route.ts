import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

const dataFilePath = path.join(process.cwd(), "data", "settings.json");

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

const defaultSettings = {
  instagram: "",
  facebook: "",
  tiktok: "",
  x_twitter: "",
  youtube: "",
  website: "",
  whatsapp: "",
  email: "",
  address: "",
  gmaps_link: "",
  hero_video_type: "none",
  hero_video_url: ""
};

function readLocalSettings() {
  if (!fs.existsSync(dataFilePath)) {
    return defaultSettings;
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContent);
  } catch {
    return defaultSettings;
  }
}

export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return NextResponse.json(docSnap.data());
        }
        const localData = readLocalSettings();
        await setDoc(docRef, localData);
        return NextResponse.json(localData);
      } catch (fbErr) {
        console.error("Firestore GET settings error, fallback:", fbErr);
      }
    }

    const data = readLocalSettings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read settings:", error);
    return NextResponse.json({ error: "Failed to read settings data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "general");
        await setDoc(docRef, data);
        return NextResponse.json({ success: true, data });
      } catch (fbErr) {
        console.error("Firestore POST settings error, fallback:", fbErr);
      }
    }
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return NextResponse.json({ error: "Failed to save settings data" }, { status: 500 });
  }
}
