"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import Rosters from "../../../../components/RostersSS";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../../context/Context.jsx";
import { startSit } from "../../../../utils/start";
import { getPlayer } from "@/app/utils/players";
import PlayerCard from "../../../../components/PlayerCard";
import DynamicLoadingText from "../../../../components/DynamicLoading";

export default function Trades() {
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

  const [adviceResult, setAdviceResult] = useState(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [swaps, setSwaps] = useState([]);

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
    console.log("Selected roster:", roster);
  };

  const handleGetAdvice = async () => {
    if (!userRoster) return;

    setIsGeneratingAdvice(true);
    try {
      const data = await startSit(league.league_id);
      setAdviceResult(data);
      console.log(data);
      const swaps = await Promise.all(
        data.output.swaps.map(async (swap) => {
          const starter = await getPlayer(swap[0]);
          const bench = await getPlayer(swap[1]);
          return [starter, bench];
        })
      );
      console.log(swaps);
      setSwaps(swaps);
    } catch (error) {
      console.error("Error generating advice:", error);
    } finally {
      setIsGeneratingAdvice(false);
    }
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

      {isLoadingRosters && <span>Loading...</span>}

      {!isLoadingRosters && (
        <>
          <button
            onClick={handleGetAdvice}
            disabled={isGeneratingAdvice}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isGeneratingAdvice ? (
              <DynamicLoadingText />
            ) : (
              "Get start-sit advice"
            )}
          </button>
          {adviceResult && (
            <div className="optimizer-output bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Start/Sit Analysis
                </h3>
              </div>

              {/* Recommended Swaps */}
              {swaps && swaps.length > 0 ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-orange-700 uppercase tracking-wide">
                      Recommended Changes
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {swaps.map((swap, index) => {
                      const [starterPlayer, benchPlayer] = swap;

                      return (
                        <div
                          key={index}
                          className="border border-orange-200 rounded-lg bg-orange-50/30 p-3"
                        >
                          <div className="grid grid-cols-2 gap-4 items-center">
                            {/* Bench Player Moving to Starter */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-4 h-4 bg-green-500 rounded-full">
                                <span className="text-white font-bold text-xs">
                                  ↑
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-green-700 font-medium uppercase mb-1">
                                  Start
                                </div>
                                <PlayerCard player={benchPlayer} />
                              </div>
                            </div>

                            {/* Swap Arrow */}
                            <div className="flex justify-center">
                              <div className="flex items-center gap-2 text-gray-400">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Starter Player Moving to Bench */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
                                <span className="text-white font-bold text-xs">
                                  ↓
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-red-700 font-medium uppercase mb-1">
                                  Bench
                                </div>
                                <PlayerCard player={starterPlayer} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* No Changes Needed */
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-green-700 uppercase tracking-wide">
                      Lineup Status
                    </h4>
                  </div>

                  <div className="border border-green-200 rounded-lg bg-green-50/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-800">
                          Your Lineup is Optimized!
                        </div>
                        <div className="text-xs text-green-700">
                          No changes recommended
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 mb-1">
                      Analysis
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {adviceResult.output.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Rosters
            userRoster={userRoster}
            selectedRoster={selectedRoster}
            otherRosters={otherRosters}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            handleRosterSelect={handleRosterSelect}
            starters={starters}
          />
        </>
      )}
      <Footer />
    </>
  );
}
