"use client";
import Login from "./Login";

export default function LoginPage() {
  return (
    <main className="grid h-full place-items-center bg-[rgb(255, 246, 255)] px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>

        <p className="text-base font-semibold text-red-500">
          Authentication Required
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl lg:text-7xl">
          Please Log In
        </h1>
        <p className="mt-6 text-lg text-pretty text-gray-600 sm:text-xl max-w-2xl mx-auto">
          You need to be logged in to access your championship strategies and
          AI-powered insights. Connect with your account to get back in the
          game.
        </p>

        <div className="mt-10 space-y-6">
          <Login />
        </div>
      </div>
    </main>
  );
}
