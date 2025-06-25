"use client";

import { useState } from "react";

export default function AuthToggle() {
  const [mode, setMode] = useState("signup"); // "signup" or "login"

  return (
    <div className="flex flex-col items-center justify-start bg-[var(--background)] p-[5vw]">
      <span className="text-[3vw] font-extrabold text-[var(--foreground)] mb-8">
        Get Started
      </span>

      {/* Toggle buttons */}
      <div className="flex flex-row items-center justify-center gap-[5vw] mb-8">
        <button
          onClick={() => setMode("signup")}
          className={`
            text-[1.5vw] w-[15vw] py-[1.25vh] font-semibold rounded-lg shadow-lg
            transition-transform duration-300
            ${
              mode === "signup"
                ? "bg-gradient-to-r from-red-500 to-yellow-400 text-white hover:scale-110"
                : "bg-slate-200 dark:bg-gray-700 text-[var(--foreground)] hover:scale-110"
            }
          `}
        >
          Sign Up
        </button>

        <button
          onClick={() => setMode("login")}
          className={`
            text-[1.5vw] w-[15vw] py-[1.25vh] font-semibold rounded-lg shadow-lg
            transition-transform duration-300
            ${
              mode === "login"
                ? "bg-gradient-to-r from-red-500 to-yellow-400 text-white hover:scale-110"
                : "bg-slate-200 dark:bg-gray-700 text-[var(--foreground)] hover:scale-110"
            }
          `}
        >
          Log In
        </button>
      </div>

      {/* Forms */}
      {mode === "signup" && (
        <form className="flex flex-col gap-4 w-[30vw] max-w-md bg-slate-200 dark:bg-gray-900 p-6 rounded-lg shadow-lg text-[var(--foreground)]">
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-slate-100 dark:bg-gray-800 dark:border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-slate-100 dark:bg-gray-800 dark:border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-red-500 to-yellow-400 py-3 rounded font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Create Account
          </button>
        </form>
      )}

      {mode === "login" && (
        <form className="flex flex-col gap-4 w-[30vw] max-w-md bg-slate-200 dark:bg-gray-900 p-6 rounded-lg shadow-lg text-">
          <input
            type="text"
            placeholder="Username"
            className="p-3 rounded bg-slate-100 dark:bg-gray-800 dark:border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded bg-slate-100 dark:bg-gray-800 dark:border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-red-500 to-yellow-400 py-3 rounded font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Log In
          </button>
        </form>
      )}
    </div>
  );
}
