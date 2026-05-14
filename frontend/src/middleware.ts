import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tokens = request.cookies.get('auth-storage'); // Zustand persist default cookie if used or manual check
  // Note: Since Zustand persist usually uses localStorage, a real middleware 
  // often needs a separate session cookie for server-side protection.
  // For now, we will look for a 'session-token' or similar if implemented.
  
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren auth
  const isPublicRoute = pathname === '/login' || pathname === '/register';
  
  // Rutas de dashboard que requieren auth
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/projects') || 
                           pathname.startsWith('/tasks') || 
                           pathname.startsWith('/users') || 
                           pathname.startsWith('/reports');

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
