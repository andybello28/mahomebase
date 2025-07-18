"use client";

import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

import { useLeagues, useUser } from "../../context/Context.jsx";

export default function Leagues() {
  const { user } = useUser();
  const { allLeagues } = useLeagues();
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const handleSelectLeague = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}`);
  };

  useEffect(() => {
    setSelectedLeagues(allLeagues);
  }, [allLeagues]);

  useEffect(() => {
    const filtered = allLeagues.filter((league) =>
      league.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedLeagues(filtered);
  }, [searchTerm, allLeagues]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col p-4 space-y-4">
        <div className="flex flex-row gap-2">
          <img
            src="/assets/sleeper.png"
            alt="Sleeper logo"
            className="w-6 h-6 object-contain"
          />
          {user?.sleeper_username && (
            <h2 className="text-xl font-bold text-slate-400">
              {user.sleeper_username}
            </h2>
          )}
        </div>

        <input
          type="text"
          placeholder="Search leagues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selectedLeagues.map((league, index) => (
            <div
              key={league.league_id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-lg font-semibold text-slate-800">
                {league.name || `League ${index + 1}`}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {league.rosters || 0} teams
                <span className="ml-2 text-slate-500">| {league.season}</span>
              </div>
              <div className="relative z-10 mt-6 text-right">
                <button
                  onClick={() => handleSelectLeague(league.league_id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:brightness-110 transition"
                >
                  More...
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
