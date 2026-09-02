export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.8
): Promise<File> {
  // Return original file if not an image or smaller than 500KB
  if (!file.type.startsWith("image/") || file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, status: res.status, error: data.error || data.message || `HTTP ${res.status}` };
      }
      return { ok: true, status: res.status, data };
    } else {
      const text = await res.text();
      if (res.status === 413 || text.includes("Request Entity Too Large")) {
        return {
          ok: false,
          status: res.status,
          error: "Ukuran file terlalu besar. Sistem telah membatasi ukuran unggahan. Silakan gunakan foto yang lebih kecil (maksimal 4MB).",
        };
      }
      return {
        ok: false,
        status: res.status,
        error: res.ok ? text : `Gagal (${res.status}): ${text.slice(0, 100)}`,
      };
    }
  } catch (err: any) {
    return { ok: false, status: 0, error: err.message || "Terjadi kesalahan jaringan." };
  }
}
