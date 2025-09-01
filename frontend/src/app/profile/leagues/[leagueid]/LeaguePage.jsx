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
    <div className="px-6">
      <Navbar />
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/profile/leagues")}
          className="mb-6 px-6 py-3 text-sm font-semibold text-black bg-white rounded-xl transition-all duration-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <span>←</span>
            <span>Back to Leagues</span>
          </div>
        </button>
      </div>
      {league && (
        <div className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300 w-full max-w-4xl mx-auto mb-10 mt-10">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                  {league.name}
                </h1>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Season</div>
                <div className="text-lg font-semibold text-gray-900">
                  {league.season}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {league.rosters}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Starters</p>
                <p className="text-2xl font-bold text-gray-900">
                  {starters.length}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Bench Spots</p>
                <p className="text-2xl font-bold text-gray-900">{benchCount}</p>
              </div>
            </div>

            <div>
              <div className="border-b border-gray-200 pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Starter Positions
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {starters.map((pos, i) =>
                  pos === "IDP_FLEX" ? (
                    <span
                      key={`starter-${i}`}
                      className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium"
                    >
                      DEFENSIVE FLEX
                    </span>
                  ) : (
                    <span
                      key={`starter-${i}`}
                      className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium"
                    >
                      {pos}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoadingRosters && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></div>
          <span className="ml-3 text-sm text-gray-600 font-medium">
            Loading league rosters...
          </span>
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
      {!isLoadingRosters && <Footer />}
    </div>
  );
}
