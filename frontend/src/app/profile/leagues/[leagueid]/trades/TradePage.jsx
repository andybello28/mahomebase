"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../../context/Context.jsx";

export default function Trades() {
  const { user } = useUser();
  const { league, leagueRosters } = useLeague();
  // const [showScoring, setShowScoring] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const starters =
    league?.roster_positions?.filter((pos) => pos !== "BN") || [];
  const benchCount =
    league?.roster_positions?.filter((pos) => pos === "BN").length || 0;

  const filteredScoring = Object.entries(league?.scoring_settings || {}).filter(
    ([key]) => key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    let user_roster_obj;
    let league_rosters = [];
    if (leagueRosters) {
      for (const roster of leagueRosters) {
        let team_obj = {
          owner_name: roster.username,
          players: [],
        };
        if (roster.owner_id === user.sleeper_id) {
          let user_roster = [];
          for (const player of roster.players) {
            let player_obj = {
              name: player.data.first_name + " " + player.data.last_name,
              positions: player.data.fantasy_positions,
              team: player.data.team,
            };
            user_roster.push(player_obj);
          }
          team_obj.players = user_roster;
          user_roster_obj = team_obj;
        } else {
          let intermediate = [];
          for (const player of roster.players) {
            let player_obj = {
              name: player.data.first_name + " " + player.data.last_name,
              positions: player.data.fantasy_positions,
              team: player.data.team,
            };
            intermediate.push(player_obj);
          }
          team_obj.players = intermediate;
          league_rosters.push(team_obj);
        }
      }
    }
  }, [leagueRosters]);

  useEffect(() => {
    console.log(leagueRosters);
  }, [leagueRosters]);
  return (
    <>
      <Navbar />
      <span>Trades</span>
      <Footer />
    </>
  );
}
