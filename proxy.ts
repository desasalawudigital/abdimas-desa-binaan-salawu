import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function proxy(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  let isValidSession = false;

  if (adminSession && adminSession.value) {
    const payload = await verifyToken(adminSession.value);
    if (payload && payload.admin === true) {
      isValidSession = true;
    }
  }
  const response = NextResponse.next();

  // Jika pengguna mencoba mengakses rute yang dimulai dengan /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Jika tidak ada session cookie atau tidak valid, alihkan ke /login
    if (!isValidSession) {
      // Clear invalid cookie if present
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('admin_session');
      return redirectResponse;
    }

    // Mencegah caching browser agar halaman tidak bisa diakses via tombol 'Back' setelah logout
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Jika mencoba mengakses halaman /login tapi sudah login, alihkan ke /admin
  if (request.nextUrl.pathname === '/login') {
    if (isValidSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

// Hanya jalankan middleware ini pada rute admin dan login
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
