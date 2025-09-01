"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import Rosters from "../../../../components/RostersTrade";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../../context/Context.jsx";
import { generateTrade } from "../../../../utils/trade.js";
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

  const [tradeResult, setTradeResult] = useState(null);
  const [isGeneratingTrade, setIsGeneratingTrade] = useState(false);
  const [receivedPlayers, setReceivedPlayers] = useState([]);
  const [tradedPlayers, setTradedPlayers] = useState([]);

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

  const handleGenerateTrade = async () => {
    if (!selectedRoster || !userRoster) return;

    setIsGeneratingTrade(true);

    try {
      const data = await generateTrade(
        league.league_id,
        selectedRoster.owner_id
      );
      setTradeResult(data);
      const playersReceived = await Promise.all(
        data.output.players_received.map((p) => getPlayer(p.id))
      );
      setReceivedPlayers(playersReceived);
      const playersTraded = await Promise.all(
        data.output.players_traded.map((p) => getPlayer(p.id))
      );
      setTradedPlayers(playersTraded);
    } catch (error) {
      console.error("Error generating trade:", error);
    } finally {
      setIsGeneratingTrade(false);
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
      <div className="flex flex-col justify-center items-center gap-6">
        {league && (
          <div className="text-lg font-semibold text-gray-900">
            {league.name}
          </div>
        )}
        <div className="flex justify-center">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => router.push("/profile/leagues")}
              className="mb-6 px-6 py-3 text-sm font-semibold text-black bg-white rounded-xl transition-all duration-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span>←</span>
                <span>Back to Leagues</span>
              </div>
            </button>
            <div className="flex w-[full] justify-center">
              <button
                onClick={handleGenerateTrade}
                disabled={isGeneratingTrade || !selectedRoster}
                className="mb-6 px-8 py-3 text-sm font-semibold text-black bg-white rounded-xl transition-all duration-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm hover:shadow-md"
              >
                {isGeneratingTrade ? (
                  <DynamicLoadingText />
                ) : (
                  "Get trade advice"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoadingRosters && <span>Loading...</span>}

      {!isLoadingRosters && (
        <>
          {tradeResult && (
            <div className="px-6">
              <div className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300 w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                    Trade Proposal
                  </h3>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Players Received Column */}
                  <div>
                    <div className="border-b border-gray-200 pb-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                          <span className="text-white font-bold text-sm">
                            ↑
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          You Receive
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {receivedPlayers.map((player, index) => (
                        <div
                          key={index}
                          className="rounded-xl bg-green-50 border border-green-200 p-4 transition-all duration-300"
                        >
                          <PlayerCard player={player} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Players Traded Column */}
                  <div>
                    <div className="border-b border-gray-200 pb-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
                          <span className="text-white font-bold text-sm">
                            ↓
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          You Give Up
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tradedPlayers.map((player, index) => (
                        <div
                          key={index}
                          className="rounded-xl bg-red-50 border border-red-200 p-4 transition-all duration-300"
                        >
                          <PlayerCard player={player} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Separator Line */}
                <hr className="border-gray-200 mb-6" />

                {/* Analysis Section */}
                <div className="mb-6">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                      <h5 className="text-lg font-semibold text-gray-900">
                        Analysis
                      </h5>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-6 transition-all duration-300">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {tradeResult.output.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-3 w-full">
            <Rosters
              userRoster={userRoster}
              selectedRoster={selectedRoster}
              otherRosters={otherRosters}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleRosterSelect={handleRosterSelect}
              starters={starters}
            />
          </div>
        </>
      )}
      <Footer />
    </>
  );
}
