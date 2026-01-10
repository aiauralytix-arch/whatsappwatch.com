"use client";

import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

// Client-side auth exports (components + hooks).
export const AuthProvider = ClerkProvider;

export {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
};
