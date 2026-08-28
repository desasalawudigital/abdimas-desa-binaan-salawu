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
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "auth", "credentials");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const creds = docSnap.data() as { username: string; password?: string };
        if (creds.password && !creds.password.startsWith("$2")) {
          const hashedPassword = await bcrypt.hash(creds.password, 10);
          creds.password = hashedPassword;
          await setDoc(docRef, creds);
        }
        return creds;
      }

      // If document doesn't exist, seed default creds
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const defaultAuth = {
        username: process.env.ADMIN_USERNAME || "admin",
        password: hashedPassword,
      };
      await setDoc(docRef, defaultAuth);
      return defaultAuth;
    } catch (error) {
      console.error("Firestore getCredentials error, falling back to local file:", error);
    }
  }

  // Fallback to local JSON file
  try {
    const data = await fs.readFile(AUTH_PATH, "utf-8");
    const creds = JSON.parse(data);
    
    // Auto-migrate plaintext password to bcrypt hash
    if (creds.password && !creds.password.startsWith("$2")) {
      console.log("Migrating plaintext password to bcrypt hash...");
      const hashedPassword = await bcrypt.hash(creds.password, 10);
      creds.password = hashedPassword;
      await fs.writeFile(AUTH_PATH, JSON.stringify(creds, null, 2), "utf-8");
    }
    
    return creds;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "ENOENT") {
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const defaultAuth = {
        username: process.env.ADMIN_USERNAME || "admin",
        password: hashedPassword,
      };
      
      try {
        await fs.mkdir(path.dirname(AUTH_PATH), { recursive: true });
        await fs.writeFile(AUTH_PATH, JSON.stringify(defaultAuth, null, 2), "utf-8");
      } catch (writeErr) {
        console.error("Failed to initialize auth.json:", writeErr);
      }
      
      return defaultAuth;
    }
    
    console.error("Error reading auth database:", error);
    return null;
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
