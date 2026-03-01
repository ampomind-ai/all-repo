import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    // Only redirect if we are in production
    if (process.env.NODE_ENV === 'production') {
        const { pathname } = request.nextUrl

        // Check if the route is already coming-soon or statically served 
        if (
            pathname.startsWith('/coming-soon') ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/static') ||
            pathname.endsWith('.png') ||
            pathname.endsWith('.ico')
        ) {
            return NextResponse.next()
        }

        // Redirect all other traffic to coming-soon
        return NextResponse.redirect(new URL('/coming-soon', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
