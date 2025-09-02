"use client";

const backend_url = process.env.NEXT_PUBLIC_API_URL;
import { toast } from "react-toastify";

export default function AuthToggle() {
  const handleGoogleLogin = () => {
    toast("Redirecting for sign in...", {
      autoClose: 500,
    });
    setTimeout(() => {
      window.location.href = `${backend_url}/auth/google`;
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center mt-12 pb-8 px-6 sm:mt-16 sm:pb-12">
      <button
        onClick={handleGoogleLogin}
        className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
