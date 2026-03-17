import { NextResponse } from 'next/server';

// Simple in-memory store for rate limiting (best effort in serverless)
const rateLimit = new Map();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export function middleware(request) {
    // Only apply to OTP API routes
    if (request.nextUrl.pathname.startsWith('/api/proxy/api/otp-apis')) {

        // 1. Origin/Referer Check
        // Get the origin of the request
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        const host = request.headers.get('host'); // e.g. localhost:3000

        // Construct valid base URLs
        const protocol = request.nextUrl.protocol; // http: or https:
        const validOrigin = `${protocol}//${host}`;

        // Allow requests with no origin/referer (server-to-server or tools like Postman usually, 
        // unless verification is strict. For browser app, these should be present)
        // But for a public web app, we want to block requests from OTHER user-agent browsers on different domains.

        // Ideally, we strictly check if origin matches our host.
        if (origin && origin !== validOrigin) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized Origin' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. Rate Limiting (IP based)
        const ip = request.ip || '127.0.0.1';
        // Use a composite key of IP and path to limit specific actions if needed, or just IP globally for OTP
        const key = `rate_limit_${ip}`;
        const now = Date.now();

        const record = rateLimit.get(key) || { count: 0, startTime: now };

        // Reset if window passed
        if (now - record.startTime > RATE_LIMIT_WINDOW) {
            record.count = 0;
            record.startTime = now;
        }

        // Increment
        record.count++;
        rateLimit.set(key, record);

        // Check limit
        if (record.count > MAX_REQUESTS) {
            return new NextResponse(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': Math.ceil((RATE_LIMIT_WINDOW - (now - record.startTime)) / 1000).toString()
                },
            });
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: '/api/proxy/api/otp-apis/:path*',
};
