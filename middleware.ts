
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log("Safe middleware running for:", request.nextUrl.pathname);
    const response = NextResponse.next();
    response.headers.set("x-deployment-id", "debug-v3-root");
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
