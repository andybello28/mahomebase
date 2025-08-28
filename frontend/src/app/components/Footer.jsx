"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-10 flex flex-col items-center justify-center space-y-6">
      <a href="/" className="transition-transform hover:scale-110 duration-300">
        <Image
          src="/favicon.ico"
          alt="Mahomebase Logo"
          width={64}
          height={64}
          className="rounded-2xl"
        />
      </a>

      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-base md:text-lg font-medium">
          © 2025 <span className="font-semibold">Mahomebase</span>. Built for
          champions.
        </p>
      </div>
    </footer>
    // <footer className="relative w-full border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-[3vh]">
    //   <div className="flex justify-between items-center px-6">
    //     {/* Left - Contact Links */}
    //     <div className="flex flex-col gap-1 text-[var(--foreground)] text-sm md:text-base font-medium">
    //       <a
    //         href="mailto:support@mahomebase.com"
    //         className="text-[var(--foreground)] font-semibold text-[1.1vw] transition-transform duration-300 hover:scale-110
    //          hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
    //       >
    //         info@mahomebase.com
    //       </a>
    //       <a
    //         href="mailto:info@mahomebase.com"
    //         className="text-[var(--foreground)] font-semibold text-[1.1vw] transition-transform duration-300 hover:scale-110
    //          hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
    //       >
    //         support@mahomebase.com
    //       </a>
    //     </div>

    //     {/* Center - Logo */}
    //     <div className="w-[10vw] mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
    //       <img
    //         src="/assets/Mahomebase_light.png"
    //         alt="Mahomebase logo"
    //         className="block dark:hidden w-full"
    //       />
    //       <img
    //         src="/assets/Mahomebase_dark.png"
    //         alt="Mahomebase logo (dark)"
    //         className="hidden dark:block w-full"
    //       />
    //     </div>

    //     {/* Right - About Section */}
    //     <div className="flex flex-col gap-1 text-[var(--foreground)] text-sm md:text-base font-medium text-right">
    //       <a
    //         href="#"
    //         className="text-[var(--foreground)] font-semibold text-[1.1vw] transition-transform duration-300 hover:scale-110
    //          hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
    //       >
    //         About Us
    //       </a>
    //       <a
    //         href="#"
    //         className="text-[var(--foreground)] font-semibold text-[1.1vw] transition-transform duration-300 hover:scale-110
    //          hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
    //       >
    //         Privacy Policy
    //       </a>
    //       <a
    //         href="#"
    //         className="text-[var(--foreground)] font-semibold text-[1.1vw] transition-transform duration-300 hover:scale-110
    //          hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
    //       >
    //         Terms of Service
    //       </a>
    //     </div>
    //   </div>
    // </footer>
  );
}
