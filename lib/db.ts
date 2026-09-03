import fs from "fs/promises";
import path from "path";
import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc
} from "firebase/firestore";
import defaultProducts from "@/data/products.json";
import defaultVisits from "@/data/visits.json";

export interface Product {
  id: string;
  name: string;
  category: "dapur" | "dekorasi" | "fashion" | "makanan" | "minuman";
  price: number;
  desc: string;
  emoji: string;
  imageUrl?: string;
  stock: number;
  dimensions: string;
  craftsman: string;
  waNumber: string;
}

export interface Visit {
  id: string;
  title: string;
  date: string;
  desc: string;
  imageEmoji: string;
  imageUrl?: string;
}

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");
const VISITS_PATH = path.join(process.cwd(), "data", "visits.json");

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID);
}

// Remove undefined values to prevent Firestore setDoc invalid data errors
function sanitizeFirestoreData<T extends object>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

// Fallback JSON operations
async function getLocalProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return (defaultProducts as Product[]) || [];
  }
}

async function saveLocalProducts(products: Product[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving local products JSON:", error);
    return false;
  }
}

async function getLocalVisits(): Promise<Visit[]> {
  try {
    const data = await fs.readFile(VISITS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return (defaultVisits as Visit[]) || [];
  }
}

async function saveLocalVisits(visits: Visit[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(VISITS_PATH), { recursive: true });
    await fs.writeFile(VISITS_PATH, JSON.stringify(visits, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving local visits JSON:", error);
    return false;
  }
}

// Products DB Operations (Firestore + Fallback)
export async function getProducts(): Promise<Product[]> {
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "products");
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Product));
      }
      
      // If Firestore is empty, seed from local JSON if available
      const localProducts = await getLocalProducts();
      if (localProducts.length > 0) {
        console.log("Seeding Firestore products collection from local JSON...");
        for (const prod of localProducts) {
          try {
            await setDoc(doc(db, "products", prod.id), sanitizeFirestoreData(prod));
          } catch (seedErr) {
            console.error("Seeding item error:", seedErr);
          }
        }
        return localProducts;
      }
      return (defaultProducts as Product[]) || [];
    } catch (error) {
      console.error("Firestore getProducts error, falling back to local file:", error);
      return getLocalProducts();
    }
  }
  return getLocalProducts();
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  if (isFirebaseConfigured()) {
    try {
      for (const prod of products) {
        await setDoc(doc(db, "products", prod.id), sanitizeFirestoreData(prod));
      }
      return true;
    } catch (error) {
      console.error("Firestore saveProducts error:", error);
      return saveLocalProducts(products);
    }
  }
  return saveLocalProducts(products);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
    } catch (error) {
      console.error("Firestore getProductById error:", error);
    }
  }
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function addProduct(product: Omit<Product, "id">): Promise<Product | null> {
  const products = await getProducts();
  const newId = (products.length > 0 ? Math.max(...products.map(p => parseInt(p.id) || 0)) + 1 : 1).toString();
  const newProduct: Product = {
    ...product,
    id: newId
  };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, "products", newId), sanitizeFirestoreData(newProduct));
      return newProduct;
    } catch (error: any) {
      console.error("Firestore addProduct error:", error);
      throw new Error("Firebase Error: " + (error.message || JSON.stringify(error)));
    }
  }

  products.push(newProduct);
  const success = await saveLocalProducts(products);
  return success ? newProduct : null;
}

export async function updateProduct(id: string, updatedFields: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const existing = products.find((p) => p.id === id);
  if (!existing) return null;

  const updatedProduct: Product = {
    ...existing,
    ...updatedFields,
    id
  };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, "products", id), sanitizeFirestoreData(updatedProduct));
      return updatedProduct;
    } catch (error) {
      console.error("Firestore updateProduct error, falling back to local storage:", error);
    }
  }

  const index = products.findIndex((p) => p.id === id);
  products[index] = updatedProduct;
  const success = await saveLocalProducts(products);
  return success ? updatedProduct : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (error) {
      console.error("Firestore deleteProduct error, falling back to local storage:", error);
    }
  }

  const products = await getLocalProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (products.length === filtered.length) return false;
  return await saveLocalProducts(filtered);
}

// Visits DB Operations (Firestore + Fallback)
export async function getVisits(): Promise<Visit[]> {
  if (isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "visits");
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Visit));
      }

      // Seed from local JSON if Firestore empty
      const localVisits = await getLocalVisits();
      if (localVisits.length > 0) {
        console.log("Seeding Firestore visits collection from local JSON...");
        for (const v of localVisits) {
          try {
            await setDoc(doc(db, "visits", v.id), sanitizeFirestoreData(v));
          } catch (seedErr) {
            console.error("Seeding visit item error:", seedErr);
          }
        }
        return localVisits;
      }
      return (defaultVisits as Visit[]) || [];
    } catch (error) {
      console.error("Firestore getVisits error, falling back to local file:", error);
      return getLocalVisits();
    }
  }
  return getLocalVisits();
}

export async function saveVisits(visits: Visit[]): Promise<boolean> {
  if (isFirebaseConfigured()) {
    try {
      for (const v of visits) {
        await setDoc(doc(db, "visits", v.id), sanitizeFirestoreData(v));
      }
      return true;
    } catch (error) {
      console.error("Firestore saveVisits error:", error);
      return saveLocalVisits(visits);
    }
  }
  return saveLocalVisits(visits);
}

export async function getVisitById(id: string): Promise<Visit | null> {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "visits", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Visit;
      }
    } catch (error) {
      console.error("Firestore getVisitById error:", error);
    }
  }
  const visits = await getVisits();
  return visits.find((v) => v.id === id) || null;
}

export async function addVisit(visit: Omit<Visit, "id">): Promise<Visit | null> {
  const visits = await getVisits();
  const newId = (visits.length > 0 ? Math.max(...visits.map(v => parseInt(v.id) || 0)) + 1 : 1).toString();
  const newVisit: Visit = {
    ...visit,
    id: newId
  };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, "visits", newId), sanitizeFirestoreData(newVisit));
      return newVisit;
    } catch (error) {
      console.error("Firestore addVisit error, falling back to local storage:", error);
    }
  }

  visits.push(newVisit);
  const success = await saveLocalVisits(visits);
  return success ? newVisit : null;
}

export async function updateVisit(id: string, updatedFields: Partial<Visit>): Promise<Visit | null> {
  const visits = await getVisits();
  const existing = visits.find((v) => v.id === id);
  if (!existing) return null;

  const updatedVisit: Visit = {
    ...existing,
    ...updatedFields,
    id
  };

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, "visits", id), sanitizeFirestoreData(updatedVisit));
      return updatedVisit;
    } catch (error) {
      console.error("Firestore updateVisit error, falling back to local storage:", error);
    }
  }

  const index = visits.findIndex((v) => v.id === id);
  visits[index] = updatedVisit;
  const success = await saveLocalVisits(visits);
  return success ? updatedVisit : null;
}

export async function deleteVisit(id: string): Promise<boolean> {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, "visits", id));
      return true;
    } catch (error) {
      console.error("Firestore deleteVisit error, falling back to local storage:", error);
    }
  }

  const visits = await getLocalVisits();
  const filtered = visits.filter((v) => v.id !== id);
  if (visits.length === filtered.length) return false;
  return await saveLocalVisits(filtered);
}

// Galleries & Settings DB Operations (Firestore + Fallback)
export async function getGalleries(): Promise<any> {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "settings", "galleries");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.error("Firestore getGalleries error, falling back to local file:", error);
    }
  }
  try {
    const galleriesPath = path.join(process.cwd(), "data", "galleries.json");
    const data = await fs.readFile(galleriesPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { seni_anyaman: [], alam_budaya: [], hero_image: null };
  }
}

export async function getSettings(): Promise<any> {
  if (isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.error("Firestore getSettings error, falling back to local file:", error);
    }
  }
  const defaultSettings = {
    instagram: "", facebook: "", tiktok: "", x_twitter: "", youtube: "",
    website: "", whatsapp: "", email: "", address: "", gmaps_link: "",
    hero_video_type: "none", hero_video_url: "",
    hero_desc: "Menghubungkan warisan kerajinan bambu tradisional, keindahan alam pegunungan, dan kearifan lokal Desa Salawu dengan ekosistem digital untuk kesejahteraan masyarakat berkelanjutan.",
    about_title: "Membangun Kemandirian Ekonomi Melalui Warisan Tradisi",
    about_desc_1: "Desa Salawu, Tasikmalaya merupakan salah satu daerah penghasil kriya anyaman bambu tertua di Jawa Barat. Keahlian ini telah diwariskan dari generasi ke generasi, menjadikan bambu sebagai urat nadi perekonomian masyarakat.",
    about_desc_2: "Melalui program pendampingan digitalisasi ini, kami berkomitmen mendukung para pengrajin dalam bertransformasi secara digital. Tujuan utama kami adalah meningkatkan daya saing UMKM lokal, melestarikan warisan seni budaya, dan memperkenalkan potensi wisata alam Salawu ke khalayak luas.",
    visit_desc: "Momen-momen indah saat menjelajahi potensi wisata alam, interaksi sosial dengan warga, dan keunikan produk kerajinan lokal Desa Salawu.",
    culture_desc: "Dari keasrian pegunungan Priangan Timur hingga harmoni irama bambu tradisional yang terjaga lestari secara turun-temurun.",
    cta_title: "Ingin Berwisata Edukasi ke Desa Salawu?",
    cta_desc: "Kami siap memandu rombongan wisatawan, institusi pendidikan, maupun jurnalis yang tertarik mengkaji industri kerajinan bambu lokal serta ekowisata alam. Hubungi tim sekretariat desa untuk koordinasi kunjungan."
  };
  try {
    const settingsPath = path.join(process.cwd(), "data", "settings.json");
    const data = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return defaultSettings;
  }
}
