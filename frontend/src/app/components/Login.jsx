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
        className="text-m sm:text-xl lg:text-2xl px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full max-w-xs sm:max-w-sm lg:max-w-md"
      >
        Get Started
      </button>
    </div>
  );
}
