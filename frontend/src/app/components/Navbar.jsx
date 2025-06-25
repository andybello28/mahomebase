"use client";

export default function Navbar() {
  return (
    <div className="flex flex-row gap-[5vw] justify-start items-center w-[100%] bg-slate-200 dark:bg-gray-900">
      {/* Light mode logo */}
      <img
        src="/assets/Mahomebase_light.png"
        alt="Mahomebase logo"
        className="w-[10vw] block dark:hidden"
      />

      {/* Dark mode logo */}
      <img
        src="/assets/Mahomebase_dark.png"
        alt="Mahomebase logo (dark)"
        className="w-[8vw] hidden dark:block"
      />
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] transition-transform duration-300 hover:scale-110 
             hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        Home
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] hover:scale-110 transition-transform duration-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        My League
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] hover:scale-110 transition-transform duration-300
                   hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        My Profile
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] hover:scale-110 transition-transform duration-300
                   hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        About
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] hover:scale-110 transition-transform duration-300
                   hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        Trade Generator
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] font-semibold text-[1.3vw] hover:scale-110 transition-transform duration-300
                   hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-400 hover:bg-clip-text hover:text-transparent"
      >
        Start/Sit
      </a>
    </div>
  );
}
