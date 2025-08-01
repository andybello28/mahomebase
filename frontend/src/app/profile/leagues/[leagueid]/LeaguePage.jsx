"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../context/Context.jsx";

export default function LeaguePage() {
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
      console.log(user_roster_obj);
      console.log(league_rosters);
    }
  }, [leagueRosters]);

  useEffect(() => {
    if (league) {
      console.log(league.scoring_settings.rec);
      console.log(league.roster_positions);
    }
  }, [league]);

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
          {/* League header */}
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

          {/* Team info */}
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

          {/* Roster Layout */}
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

          {/* <div>
            <button
              onClick={() => setShowScoring((prev) => !prev)}
              className="w-full text-left px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:brightness-110 transition-all font-medium"
            >
              {showScoring ? "Hide" : "Show"} Scoring Settings
            </button>

            {showScoring && (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Search scoring setting..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredScoring.length > 0 ? (
                    filteredScoring.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-200"
                      >
                        <span className="text-sm text-slate-600 font-medium">
                          {key.toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic col-span-full">
                      No settings match your search.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div> */}
        </div>
      )}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {leagueRosters
          ?.filter((roster) => roster.owner_id) // only rosters with owner_id
          .map((roster, idx) => (
            <div
              key={roster.roster_id || idx}
              className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-bold mb-2">
                {roster.username || roster.owner_id}
                {roster.owner_id === user?.sleeper_id && (
                  <span className="text-green-600 ml-2">(My Team)</span>
                )}
              </h2>

              <div className="text-sm text-gray-700 mb-2 font-medium">
                Record: {roster.settings.wins} - {roster.settings.losses}
                {roster.settings.ties !== 1 && ` - ${roster.settings.ties}`}
              </div>

              <div className="mb-3">
                {roster.starters && roster.starters.length > 0 && (
                  <strong>Starters:</strong>
                )}

                <ul className="list-disc list-inside ml-4">
                  {!roster.starters || roster.starters.length === 0 ? (
                    <>Empty Roster</>
                  ) : (
                    roster.starters.map(({ id, data }, index) =>
                      data ? (
                        <li key={id || index}>
                          <span className="font-semibold text-slate-600 mr-2">
                            {data.position || "N/A"}:
                          </span>
                          {`${data.first_name || ""} ${
                            data.last_name || ""
                          }`.trim()}
                        </li>
                      ) : (
                        <li key={index}>
                          <span className="font-semibold text-slate-600 mr-2">
                            {starters[index] || "N/A"}:
                          </span>
                        </li>
                      )
                    )
                  )}
                </ul>
              </div>

              <div className="mb-3">
                {roster.players && roster.players.length > 0 && (
                  <strong>Bench:</strong>
                )}
                <ul className="list-disc list-inside ml-4">
                  {roster.players
                    .filter(
                      (benchPlayer) =>
                        !roster.starters.some(
                          (starter) => starter.id === benchPlayer.id
                        )
                    )
                    .map((benchPlayer, index) =>
                      benchPlayer.data ? (
                        <li key={benchPlayer.id || index}>
                          <span className="font-semibold text-slate-600 mr-2">
                            {benchPlayer.data.position || "N/A"}:
                          </span>
                          {`${benchPlayer.data.first_name} ${benchPlayer.data.last_name}`.trim()}
                        </li>
                      ) : (
                        <li key={benchPlayer.id || index}>
                          {" "}
                          <span className="font-semibold text-slate-600 mr-2">
                            {starter || "N/A"}:
                          </span>
                          Empty
                        </li>
                      )
                    )}
                </ul>
              </div>
            </div>
          ))}
      </div>

      <Footer />
    </>
  );
}
