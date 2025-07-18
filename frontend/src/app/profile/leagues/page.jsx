"use client";

import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

import { useLeagues } from "../../context/Context.jsx";

export default function Leagues() {
  const { allLeagues, years } = useLeagues();
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");

  const router = useRouter();

  const handleSelectLeague = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}`);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year === "All") {
      setSelectedLeagues(allLeagues);
    } else {
      const filtered = allLeagues.filter((league) => league.season === year);
      setSelectedLeagues(filtered);
    }
  };

  useEffect(() => {
    setSelectedLeagues(allLeagues);
  }, [allLeagues]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center">
        {" "}
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className="px-3 py-2 text-[var(--foreground)] bg-[var(--background)] border border-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-all duration-300"
        >
          <option value="All">All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
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

      <Footer />
    </>
  );
}
