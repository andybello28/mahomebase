"use client";

const backend_url = process.env.NEXT_PUBLIC_API_URL;

export default function AuthToggle() {
  const handleGoogleLogout = () => {
    window.location.href = `${backend_url}/auth/logout`;
  };

  return (
    <div className="flex flex-col items-center mt-[5vh] pb-[3vh]">
      <button
        onClick={handleGoogleLogout}
        className="text-[1.5vw] px-[3vw] py-[1.5vh] bg-gradient-to-r from-red-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:from-red-600 hover:to-yellow-500 transition-transform duration-300"
      >
        Logout
      </button>
    </div>
  );
}
