"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import Rosters from "../../../../components/Rosters";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../../context/Context.jsx";

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
      console.log(league_rosters);
      console.log(user_roster);
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
