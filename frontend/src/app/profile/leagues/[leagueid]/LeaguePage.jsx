"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../context/Context.jsx";
import Rosters from "../../../components/RostersLeague";

export default function LeaguePage() {
  const { user } = useUser();
  const { league, leagueRosters } = useLeague();
  // const [showScoring, setShowScoring] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [userRoster, setUserRoster] = useState(null);
  const [otherRosters, setOtherRosters] = useState([]);
  const [isLoadingRosters, setIsLoadingRosters] = useState(true);

  const starters =
    league?.roster_positions?.filter((pos) => pos !== "BN") || [];
  const benchCount =
    league?.roster_positions?.filter((pos) => pos === "BN").length || 0;

  const filteredScoring = Object.entries(league?.scoring_settings || {}).filter(
    ([key]) => key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRosterSelect = (roster) => {
    setSelectedRoster(roster);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    let user_roster;
    let league_rosters = [];
    if (leagueRosters) {
      for (const roster of leagueRosters) {
        if (roster.owner_id === user?.sleeper_id) {
          user_roster = roster;
        } else {
          if (roster.owner_id) {
            league_rosters.push(roster);
          }
        }
      }
      setSelectedRoster(league_rosters[0]);
      setOtherRosters(league_rosters);
      setUserRoster(user_roster);
      setIsLoadingRosters(false);
    }
  }, [leagueRosters]);

  return (
    <>
      <Navbar />
      <button
        onClick={() => router.push("/profile/leagues")}
        className="mb-6 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-xl hover:bg-slate-800 transition"
      >
        <div>← Back to Leagues</div>
      </button>
      {league && (
        <div className="max-w-4xl mb-10 mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">
                {league.name}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Season</div>
              <div className="text-lg font-semibold text-cyan-600">
                {league.season}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-sm text-slate-500">Teams</p>
              <p className="text-2xl font-bold text-slate-800">
                {league.rosters}
              </p>
            </div>
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-sm text-slate-500">Starters</p>
              <p className="text-2xl font-bold text-slate-800">
                {starters.length}
              </p>
            </div>
            <div className="bg-slate-100 rounded-xl p-4">
              <p className="text-sm text-slate-500">Bench Spots</p>
              <p className="text-2xl font-bold text-slate-800">{benchCount}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Starters Positions
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {starters.map((pos, i) =>
                pos === "IDP_FLEX" ? (
                  <span
                    key={`starter-${i}`}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                  >
                    DEFENSIVE FLEX
                  </span>
                ) : (
                  <span
                    key={`starter-${i}`}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                  >
                    {pos}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoadingRosters && (
        <Rosters
          userRoster={userRoster}
          selectedRoster={selectedRoster}
          otherRosters={otherRosters}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleRosterSelect={handleRosterSelect}
          starters={starters}
        />
      )}
      <Footer />
    </>
  );
}
