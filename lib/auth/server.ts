import { auth, clerkMiddleware, currentUser } from "@clerk/nextjs/server";

// Server-side auth exports (helpers + middleware).
export const authMiddleware = clerkMiddleware;

export { auth, currentUser };
