"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token:any = searchParams.get("token") || ""

  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    try {
      setVerifying(true);
      await toast.promise(
        axios.post("/api/auth/verify", { token }),
        {
          loading: "Verifying...",
          success: "Email verified successfully!",
          error: "Verification failed",
        }
      );
      router.push("/login");
    } catch (err) {
      setVerifying(false);
    }
  };

  useEffect(()=>{
    if(token.length>0){
        handleVerify()
    }
},[token])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 text-white">
      <div className="max-w-md w-full bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg text-center space-y-6">
        <h1 className="text-3xl font-bold">Email Verification</h1>
        <p className="text-gray-400 text-sm">
          Click the button below to verify your email.
        </p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className={`w-full py-2 rounded-lg text-white transition duration-200 ${
            verifying
              ? "bg-blue-600 opacity-50 cursor-not-allowed blur-[1px]"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {verifying ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
}
