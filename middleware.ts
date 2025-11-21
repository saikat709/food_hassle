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
         * - api/meal-plan (meal plan API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth (auth page)
         * - public (public assets if any)
         */
        "/((?!api/auth|api/meal-plan|_next/static|_next/image|favicon.ico|auth).*)",
    ],
};
