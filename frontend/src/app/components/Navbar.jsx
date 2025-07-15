"use client";

import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { fetchCurrentUser } from "../utils/auth";
import { toast } from "react-toastify";

const backend_url = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleGoogleLogin = () => {
    toast("Redirecting for sign in...", {
      autoClose: 500,
    });
    setTimeout(() => {
      window.location.href = `${backend_url}/auth/google`;
    }, 1000);
  };

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Trade Generator", href: "#" },
    { name: "Start/Sit", href: "#" },
    { name: "Waiver Wire", href: "#" },
    { name: "League Overview", href: "/profile/leagues" },
  ];

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/assets/Mahomebase_light.png"
              alt="Mahomebase logo"
              className="w-[10vw] block dark:hidden"
            />
            <img
              src="/assets/Mahomebase_dark.png"
              alt="Mahomebase logo"
              className="w-[10vw] hidden dark:block"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[var(--foreground)] font-semibold text-[1.2vw] transition-transform duration-300 hover:scale-110
                           hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent px-3 py-2"
                >
                  {item.name}
                </a>
              ))}
              {user ? (
                <a
                  href="/profile"
                  className="flex flex-row gap-2 justify-center items-center font-semibold transition-transform duration-300 hover:scale-120 px-3 py-2"
                >
                  <span className="text-[var(--foreground)] text-[2vw]">
                    <CgProfile className="inline-block" />
                  </span>
                </a>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="flex flex-row gap-2 justify-center items-center font-semibold transition-transform duration-300 hover:scale-120 px-3 py-2"
                >
                  <span className="text-[var(--foreground)] text-[2vw]">
                    <CgProfile className="inline-block" />
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200 cursor-pointer"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-[2vw] font-semibold text-[var(--foreground)] transition-transform duration-300 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          {user ? (
            <a
              href="/profile"
              className="block px-3 py-2 text-[2vw] font-semibold text-[var(--foreground)] transition-transform duration-300 rounded-md cursor-pointer"
            >
              Profile
            </a>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="block px-3 py-2 text-[2vw] font-semibold text-[var(--foreground)] transition-transform duration-300 rounded-md cursor-pointer"
            >
              Profile
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
