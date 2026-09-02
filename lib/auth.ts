import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AUTH_PATH = path.join(process.cwd(), "data", "auth.json");

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

export async function getCredentials() {
  const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
  let hashedPassword = "";
  try {
    hashedPassword = await bcrypt.hash(defaultPassword, 10);
  } catch {
    hashedPassword = "$2b$10$H7HjvWfCRRI1Qrao6kz.Xe8isxtQvolXtf61IP.E5LCrjvixFDFIe";
  }
  const defaultAuth = {
    username: process.env.ADMIN_USERNAME || "admin",
    password: hashedPassword,
  };

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "auth", "credentials");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const creds = docSnap.data() as { username: string; password?: string };
        if (creds.password && !creds.password.startsWith("$2")) {
          const hp = await bcrypt.hash(creds.password, 10);
          creds.password = hp;
          try { await setDoc(docRef, creds); } catch {}
        }
        return creds;
      }

      // If document doesn't exist, seed default creds safely
      try {
        await setDoc(docRef, defaultAuth);
      } catch (seedErr) {
        console.error("Firestore seed credentials error:", seedErr);
      }
      return defaultAuth;
    } catch (error) {
      console.error("Firestore getCredentials error, falling back:", error);
    }
  }

  // Fallback to local JSON file or defaultAuth
  try {
    const data = await fs.readFile(AUTH_PATH, "utf-8");
    const creds = JSON.parse(data);
    return creds;
  } catch {
    return defaultAuth;
  }
}

export async function saveCredentials(newPassword: string) {
  const currentCreds = await getCredentials();
  if (!currentCreds) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedAuth = {
    ...currentCreds,
    password: hashedPassword,
  };

  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "auth", "credentials");
      await setDoc(docRef, updatedAuth);
      return true;
    } catch (error) {
      console.error("Firestore saveCredentials error:", error);
      return false;
    }
  }

  try {
    await fs.mkdir(path.dirname(AUTH_PATH), { recursive: true });
    await fs.writeFile(AUTH_PATH, JSON.stringify(updatedAuth, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving auth database:", error);
    return false;
  }
}
