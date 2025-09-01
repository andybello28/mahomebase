"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useUser } from "./context/Context";
import { toast } from "react-toastify";

import Image from "next/image";

const backend_url = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { user } = useUser();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const heroTimer = setTimeout(() => {
      setHeroVisible(true);
    }, 100);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsContentVisible(true);
      } else {
        setIsContentVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(heroTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGoogleLogin = () => {
    toast("Redirecting for sign in...", { autoClose: 500 });
    setTimeout(() => {
      window.location.href = `${backend_url}/auth/google`;
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-start justify-center mt-6 min-h-screen px-4">
        <div className="text-center w-full max-w-7xl mx-auto pb-5">
          <h1
            className={`hidden md:block text-5xl md:text-7xl font-bold text-gray-900 mb-6 transition-all duration-1000 ease-out ${
              heroVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            Mahomebase
          </h1>

          <h2
            className={`text-2xl md:text-3xl font-normal text-gray-900 mb-4 transition-all duration-1000 ease-out delay-200 ${
              heroVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            Your Home Base for
          </h2>
          <h2
            className={`text-2xl md:text-3xl font-bold text-red-600 mb-8 transition-all duration-1000 ease-out delay-300 ${
              heroVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            Fantasy Football Domination
          </h2>

          <p
            className={`text-lg md:text-xl text-gray-800 font-normal leading-relaxed mb-8 max-w-2xl mx-auto transition-all duration-1000 ease-out delay-500 ${
              heroVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            Updated <span className="font-bold">AI-driven insights </span>
            and{" "}
            <span className="font-bold">
              championship-winning strategies{" "}
            </span>{" "}
            connected right to your <span className="font-bold">sleeper</span>{" "}
            account. Here's to getting that ring.
          </p>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-6xl mx-auto transition-all duration-1000 ease-out delay-700 ${
              heroVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            <div className="text-center p-6 group  transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-powered Analytics
              </h3>
              <p className="text-gray-800">
                Deep analysis catered directly to your team, opponents rosters,
                league settings, and live NFL data.
              </p>
            </div>

            <div className="text-center p-6 group transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Up to Date Insights
              </h3>
              <p className="text-gray-800">
                Up to date on all your sleeper settings, league info, NFL data,
                and player news.
              </p>
            </div>

            <div className="text-center p-6 group transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Championship Strategies
              </h3>
              <p className="text-gray-800">
                Proven methods and personalized game plans to maximize your
                winning potential.
              </p>
            </div>
          </div>

          <div
            className={`mt-16 animate-bounce transition-all duration-1000 ease-out delay-1000 ${
              heroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center mx-auto">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-4 transition-all duration-1000 ease-out ${
          isContentVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto space-y-16 pb-0">
          <div
            className={`text-gray-900 text-2xl md:text-3xl font-semibold text-center leading-relaxed transition-all duration-1000 ease-out delay-100 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Welcome to the future of fantasy football.
          </div>

          <div
            className={`text-gray-800 text-lg md:text-xl font-normal text-center leading-relaxed max-w-4xl mx-auto transition-all duration-1000 ease-out delay-200 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Fantasy football is <span className="font-bold">hard</span>. We find
            ourselves teetering back and forth between players on the waiver
            wire, bench, or in trades. Tired of{" "}
            <span className="font-bold">
              generic advice, gut-based trades, and hours
            </span>{" "}
            deciding who to start, we created what we always wished we had.
          </div>

          <div
            className={`text-gray-800 text-lg md:text-xl font-normal text-center leading-relaxed max-w-4xl mx-auto transition-all duration-1000 ease-out delay-400 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            More than just a tool, Mahomebase is creating an{" "}
            <span className="font-bold">intelligent</span> platform that
            transforms raw data into actionable insights for{" "}
            <span className="font-bold">all</span> your leagues,{" "}
            <span className="font-bold">centralized</span> in one place. Whether
            you're chasing your first championship or adding another ring to
            your collection, Mahomebase is designed to be your competitive edge.
          </div>

          <div
            className={`flex justify-center transition-all duration-1000 ease-out delay-600 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-md md:max-w-none">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/sleeper.png"
                  alt="Sleeper Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg"
                />
                <span className="text-gray-900 mt-2 font-medium text-sm md:text-base">
                  Available
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Image
                  src="/assets/espn.png"
                  alt="ESPN Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg"
                />
                <span className="text-gray-500 mt-2 text-xs md:text-sm italic">
                  Coming Soon...
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Image
                  src="/assets/nfl.png"
                  alt="NFL Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg"
                />
                <span className="text-gray-500 mt-2 text-xs md:text-sm italic">
                  Coming Soon...
                </span>
              </div>
            </div>
          </div>

          <div
            className={`text-gray-900 text-2xl md:text-3xl font-semibold text-center leading-relaxed transition-all duration-1000 ease-out delay-700 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Ready to dominate your leagues?
          </div>

          <div
            className={`flex justify-center transition-all duration-1000 ease-out delay-800 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {!user && (
              <button
                onClick={handleGoogleLogin}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started Now
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
