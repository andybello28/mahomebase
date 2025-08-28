"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useUser } from "../context/Context.jsx";

const backend_url = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGoogleLogin = () => {
    toast("Redirecting for sign in...", { autoClose: 500 });
    setTimeout(() => {
      window.location.href = `${backend_url}/auth/google`;
    }, 1000);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Leagues", href: "/profile/leagues" },
  ];

  return (
    <>
      <nav className="absolute top-4 left-1/2 -translate-x-1/2 w-[100vw] z-50 pr-3">
        <div className="relative bg-transparent rounded-full px-0 pt-10 min-h-[90px]">
          <div className="hidden md:flex items-center justify-center relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -ml-48 flex justify-end w-32">
              {navItems
                .filter((item) => item.name !== "Home")
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="mt-3 text-gray-900 hover:text-red-600 font-bold text-large relative group transition-colors duration-300"
                  >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </a>
                ))}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a
                href="/"
                className="flex items-center justify-center space-x-3 transition-transform hover:scale-105 duration-300"
              >
                <Image
                  src="/favicon.ico"
                  alt="Mahomebase Logo"
                  width={64}
                  height={64}
                  className="rounded-xl"
                />
              </a>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ml-48 flex justify-start w-32">
              {user ? (
                <a
                  href="/profile"
                  className="mt-3 text-gray-900 hover:text-red-600 font-bold text-large relative group transition-colors duration-300"
                >
                  Profile
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="mt-3 text-gray-900 hover:text-red-600 font-bold text-large relative group transition-colors duration-300"
                >
                  Profile
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="absolute left-4 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <Image
                src="/favicon.ico"
                alt="Mahomebase Logo"
                width={45}
                height={45}
                className="rounded-xl"
              />
              <span className="text-gray-900 font-bold text-xl tracking-tight">
                Mahomebase
              </span>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-[90px] w-[100vw] mx-auto bg-transparent rounded-2xl">
          <div className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-900 hover:text-red-600 font-bold transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            {user ? (
              <a
                href="/profile"
                className="text-gray-900 hover:text-red-600 font-bold transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </a>
            ) : (
              <button
                onClick={() => {
                  handleGoogleLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-900 hover:text-red-600 font-bold transition-colors duration-300"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      )}

      {!isMobileMenuOpen && <div className="h-32" />}
    </>
  );
}
