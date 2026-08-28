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

// Fallback JSON operations
async function getLocalProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local products JSON:", error);
    return [];
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
    console.error("Error reading local visits JSON:", error);
    return [];
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
          await setDoc(doc(db, "products", prod.id), prod);
        }
        return localProducts;
      }
      return [];
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
        await setDoc(doc(db, "products", prod.id), prod);
      }
      return true;
    } catch (error) {
      console.error("Firestore saveProducts error:", error);
      return false;
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
      await setDoc(doc(db, "products", newId), newProduct);
      return newProduct;
    } catch (error) {
      console.error("Firestore addProduct error:", error);
      return null;
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
      await setDoc(doc(db, "products", id), updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error("Firestore updateProduct error:", error);
      return null;
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
      console.error("Firestore deleteProduct error:", error);
      return false;
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
          await setDoc(doc(db, "visits", v.id), v);
        }
        return localVisits;
      }
      return [];
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
        await setDoc(doc(db, "visits", v.id), v);
      }
      return true;
    } catch (error) {
      console.error("Firestore saveVisits error:", error);
      return false;
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
      await setDoc(doc(db, "visits", newId), newVisit);
      return newVisit;
    } catch (error) {
      console.error("Firestore addVisit error:", error);
      return null;
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
      await setDoc(doc(db, "visits", id), updatedVisit);
      return updatedVisit;
    } catch (error) {
      console.error("Firestore updateVisit error:", error);
      return null;
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
      console.error("Firestore deleteVisit error:", error);
      return false;
    }
  }

  const visits = await getLocalVisits();
  const filtered = visits.filter((v) => v.id !== id);
  if (visits.length === filtered.length) return false;
  return await saveLocalVisits(filtered);
}
