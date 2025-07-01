"use client";

import { useState, useEffect } from "react";

import { fetchCurrentUser } from "./utils/auth";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col items-center justify-start">
        <span className="text-[5vw] font-extrabold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-[5vh] mt-[4vh] transition-transform duration-300 cursor-default inline-block max-w-full">
          Mahomebase
        </span>
        <div className="text-[var(--foreground)] mb-[5vh] text-[1.5vw] font-semibold max-w-[70vw] text-center leading-relaxed">
          Welcome to the future of fantasy football.
        </div>
        <div className="text-[var(--foreground)] mb-[5vh] text-[1.5vw] font-semibold max-w-[70vw] text-center leading-relaxed">
          Mahomebase was born out of a simple idea: fantasy football should be
          smarter, faster, and more personalized. We were tired of generic
          advice, gut-based trades, and spending hours analyzing matchups with
          incomplete data — so we built the tool we always wished we had.
        </div>
        <div className="text-[var(--foreground)] mb-[5vh] text-[1.5vw] font-semibold max-w-[70vw] text-center leading-relaxed">
          At Mahomebase, we use cutting-edge AI technology to deliver fantasy
          football insights tailored specifically to your team and league. By
          securely connecting your Sleeper account, we provide real-time trade
          recommendations and lineup optimizations designed to help you outsmart
          your opponents and win more matchups. No more guesswork. No more
          scrolling forums or second-guessing advice from strangers.
        </div>
        <div className="text-[var(--foreground)] mb-[5vh] text-[1.5vw] font-semibold max-w-[70vw] text-center leading-relaxed">
          With Mahomebase, you get intelligent, data-driven support — all in one
          place. Whether you're chasing your first championship or going for
          another ring, Mahomebase is your competitive edge. We're just getting
          started, and we're excited to have you on this journey with us.
        </div>
        <div className="text-[var(--foreground)] text-[1.5vw] font-semibold max-w-[70vw] text-center leading-relaxed">
          Ready to dominate your leagues?
        </div>
        {!user && <Login />}
      </div>
      <Footer />
    </div>
  );
}
