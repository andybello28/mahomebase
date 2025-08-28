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
    <div className="flex flex-col items-center mt-[5vh] pb-[3vh]">
      <button
        onClick={handleGoogleLogin}
        className="text-[1.5vw] px-[3vw] py-[1.5vh] bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all duration-300"
      >
        Get Started
      </button>
    </div>
  );
}
