import { NextRequest, NextResponse } from 'next/server';

const MOBILE_UA = /android|iphone|ipad|ipod|blackberry|windows phone/i;

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';

  if (MOBILE_UA.test(ua)) {
    return NextResponse.redirect(new URL('/desktop-only', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!desktop-only|_next|favicon.ico).*)'],
};

// TODO : eletron 환경 세팅 필요
