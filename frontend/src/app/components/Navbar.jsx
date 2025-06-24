"use client";

export default function Navbar() {
  return (
    <div className="flex flex-row gap-[5vw] justify-start items-center w-[100%]">
      <img
        src="/assets/Mahomebase.png"
        alt="Mahomebase logo"
        className="w-[10vw]"
      />
      <a href="#" className="text-white text-[1.2vw] hover:underline px-2">
        Home
      </a>
      <a href="#" className="text-white text-[1.2vw] hover:underline px-2">
        My League
      </a>
      <a href="#" className="text-white text-[1.2vw] hover:underline px-2">
        AI Tools
      </a>
      <a href="#" className="text-white text-[1.2vw] hover:underline px-2">
        My Profile
      </a>
    </div>
  );
}
