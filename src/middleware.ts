import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Backend sets 'access_token' via httpOnly cookie, but we also check 'token' for fallback
  const token = request.cookies.get('access_token')?.value || request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes — belum login redirect ke home
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // User sudah login, coba akses halaman role selection
  if (token && pathname === '/pilih-role') {
    // Sudah punya role → langsung ke dashboard yang sesuai
    if (role === 'volunteer') {
      return NextResponse.redirect(new URL('/dashboard/relawan', request.url));
    }
    if (role === 'lembaga') {
      return NextResponse.redirect(new URL('/dashboard/pelapor', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/pilih-role'],
};