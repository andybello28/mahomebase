"use client";

import AuthToggle from "./components/AuthToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-[5vw] bg-black">
      <span
        className="
    text-[5vw] font-extrabold
    bg-gradient-to-r from-red-500 to-yellow-400
    bg-clip-text text-transparent
    mb-[8vh] mt-[4vh]
    transition-transform duration-300
    cursor-default
    inline-block
    max-w-full
  "
      >
        Mahomebase
      </span>

      <div
        className="
          text-white
          text-[1.5vw]
          font-semibold
          font-[family-name:var(--font-ubuntu)]
          max-w-[70vw]
          text-center
          leading-relaxed
        "
      >
        Mahomebase uses cutting-edge AI technology to provide personalized
        fantasy football trade advice tailored specifically to your team. By
        securely connecting your Sleeper account, you get real-time
        recommendations that help you make smarter trades, optimize your lineup,
        and gain the competitive edge needed to dominate your league. Save time,
        minimize guesswork, and maximize your wins with our easy-to-use,
        data-driven platform — the future of fantasy football management is
        here.
      </div>
      <AuthToggle />
    </div>
  );
}
