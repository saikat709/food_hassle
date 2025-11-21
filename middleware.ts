import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth",
    },
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - api/test (test API route)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth (auth page)
         * - public (public assets if any)
         */
        "/((?!api/auth|api/test|_next/static|_next/image|favicon.ico|auth).*)",
    ],
};
