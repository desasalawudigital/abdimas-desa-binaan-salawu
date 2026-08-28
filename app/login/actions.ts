"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { getCredentials, saveCredentials } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const creds = await getCredentials();

  if (!creds) {
    return { error: "Gagal memuat kredensial admin." };
  }

  if (username !== creds.username) {
    return { error: "Username atau password salah!" };
  }

  const isPasswordValid = await bcrypt.compare(password, creds.password);

  if (isPasswordValid) {
    const token = await signToken({ username, admin: true });
    
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
      sameSite: "lax",
    });
    redirect("/admin"); // Jika sukses, arahkan ke admin
  } else {
    return { error: "Username atau password salah!" };
  }
}

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return { error: "Semua kolom harus diisi." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Password baru dan konfirmasi tidak cocok." };
  }

  if (newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter." };
  }

  const creds = await getCredentials();
  if (!creds) {
    return { error: "Gagal memuat kredensial." };
  }
  
  const isOldPasswordValid = await bcrypt.compare(oldPassword, creds.password);
  
  if (!isOldPasswordValid) {
    return { error: "Password lama salah." };
  }

  const success = await saveCredentials(newPassword);
  if (success) {
    return { success: "Password berhasil diubah!" };
  } else {
    return { error: "Gagal menyimpan password baru." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}
