"use client";

const backend_url = process.env.NEXT_PUBLIC_API_URL;
import { toast } from "react-toastify";

export default function AuthToggle() {
  const handleGoogleLogout = () => {
    toast("Redirecting for logout...", {
      autoClose: 500,
    });
    setTimeout(() => {
      window.location.href = `${backend_url}/auth/logout`;
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center mt-12 pb-8">
      <button
        onClick={handleGoogleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        Logout
      </button>
    </div>
  );
}
