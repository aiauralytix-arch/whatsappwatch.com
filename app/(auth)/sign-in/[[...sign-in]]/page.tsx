import { SignIn } from "@/lib/auth/client";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6 py-16">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
