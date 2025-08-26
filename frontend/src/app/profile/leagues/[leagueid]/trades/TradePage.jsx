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
            onClick={handleGenerateTrade}
            disabled={isGeneratingTrade || !selectedRoster}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isGeneratingTrade ? (
              <DynamicLoadingText />
            ) : (
              "Get start-sit advice"
            )}
          </button>

          {tradeResult && (
            <div className="trade-output bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Trade Proposal
                </h3>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Players Received Column */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                      <span className="text-white font-bold text-xs">+</span>
                    </div>
                    <h4 className="text-sm font-medium text-green-700 uppercase tracking-wide">
                      You Receive
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {receivedPlayers.map((player, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-green-50/30 p-2"
                      >
                        <PlayerCard player={player} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Players Traded Column */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                      <span className="text-white font-bold text-xs">−</span>
                    </div>
                    <h4 className="text-sm font-medium text-red-700 uppercase tracking-wide">
                      You Give Up
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {tradedPlayers.map((player, index) => (
                      <div key={index} className="rounded-lg bg-red-50/30 p-2">
                        <PlayerCard player={player} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
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
                      {tradeResult.output.explanation}
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
    </>
  );
}
