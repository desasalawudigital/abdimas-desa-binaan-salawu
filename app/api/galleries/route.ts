import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const dataFilePath = path.join(process.cwd(), "data", "galleries.json");

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

function readLocalGalleries() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return {
      seni_anyaman: [],
      alam_budaya: []
    };
  }
}

export async function GET() {
  try {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "galleries");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return NextResponse.json(docSnap.data());
        }
        const localData = readLocalGalleries();
        await setDoc(docRef, localData);
        return NextResponse.json(localData);
      } catch (fbErr) {
        console.error("Firestore GET galleries error, fallback:", fbErr);
      }
    }
    const galleries = readLocalGalleries();
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Failed to read galleries data:", error);
    return NextResponse.json({ error: "Failed to fetch galleries data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, "settings", "galleries");
        await setDoc(docRef, body);
        return NextResponse.json({ success: true, galleries: body });
      } catch (fbErr) {
        console.error("Firestore POST galleries error, fallback:", fbErr);
      }
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, galleries: body });
  } catch (error) {
    console.error("Failed to save galleries data:", error);
    return NextResponse.json({ error: "Failed to save galleries data" }, { status: 500 });
  }
}
