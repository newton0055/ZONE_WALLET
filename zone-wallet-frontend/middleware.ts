import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for token in cookies
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                    request.nextUrl.pathname.startsWith('/sign-up');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected pages while not logged in, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up'
  ]
}; 