"use client";

export default function Navbar() {
  return (
    <div className="flex flex-row gap-[5vw] justify-start items-center w-[100%]">
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
        className="w-[10vw] hidden dark:block"
      />
      <a
        href="#"
        className="text-[var(--foreground)] text-[1.2vw] hover:scale-110 transition-transform duration-300"
      >
        Home
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] text-[1.2vw] hover:scale-110 transition-transform duration-300"
      >
        My League
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] text-[1.2vw] hover:scale-110 transition-transform duration-300"
      >
        AI Tools
      </a>
      <a
        href="#"
        className="text-[var(--foreground)] text-[1.2vw] hover:scale-110 transition-transform duration-300"
      >
        My Profile
      </a>
    </div>
  );
}
