import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isApiRequest = request.nextUrl.pathname.startsWith('/api');

    // Pomijamy middleware dla zapytań API
    if (isApiRequest) {
        return NextResponse.next();
    }

    // Jeśli użytkownik jest zalogowany i próbuje dostać się do strony auth
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do chronionej strony
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};