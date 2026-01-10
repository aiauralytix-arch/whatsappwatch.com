import { SignUp } from "@/lib/auth/client";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6 py-16">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
