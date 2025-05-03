// app/verify-email/page.tsx
"use client";

import Link from "next/link";

export default function VerifyEmailNoticePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 text-white">
      <div className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-500">Verify Your Email</h1>
        <p className="mt-4 text-gray-300">
          We've sent a verification link to your email address. <br />
          Please check your inbox and click on the link to activate your account.
        </p>

        <div className="mt-6">
          <Link href="/login" className="text-sm text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
