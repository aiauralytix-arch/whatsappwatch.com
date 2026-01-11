import { authMiddleware, createRouteMatcher } from "@/lib/auth/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default authMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};