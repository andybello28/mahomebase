"use client";

import { ChevronDown } from "lucide-react";
import PlayerCard from "../components/PlayerCard";
import Roster from "../components/Roster";

export default function Rosters({
  userRoster,
  selectedRoster,
  otherRosters,
  isDropdownOpen,
  setIsDropdownOpen,
  handleRosterSelect,
  starters,
}) {
  return (
    <div className="flex flex-row">
      <Roster roster={userRoster} starters={starters} />

      <button>Generate Trades</button>

      <div
        key={selectedRoster?.roster_id}
        className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
      >
        <h2 className="text-lg font-bold mb-2">
          {selectedRoster?.username || selectedRoster?.owner_id || "My Team"}
        </h2>

        <div className="text-sm text-gray-700 mb-2 font-medium">
          Record: {selectedRoster?.settings.wins} -{" "}
          {selectedRoster?.settings.losses}
          {selectedRoster?.settings.ties !== 1 &&
            ` - ${selectedRoster?.settings.ties}`}
        </div>

        <div className="mb-3">
          {selectedRoster?.starters && selectedRoster?.starters.length > 0 && (
            <strong>Starters:</strong>
          )}

          <ul className="list-disc list-inside ml-4">
            {!selectedRoster?.starters ||
            selectedRoster?.starters.length === 0 ? (
              <>Empty Roster</>
            ) : (
              selectedRoster?.starters.map(({ id, data }, index) =>
                data ? (
                  <li key={id || index}>
                    <span className="font-semibold text-slate-600 mr-2">
                      {data.position || "N/A"}:
                    </span>
                    <PlayerCard key={id || index} player={data} />
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
          {selectedRoster?.players && selectedRoster?.players.length > 0 && (
            <strong>Bench:</strong>
          )}
          <ul className="list-disc list-inside ml-4">
            {selectedRoster?.players
              .filter(
                (benchPlayer) =>
                  !selectedRoster?.starters.some(
                    (starter) => starter.id === benchPlayer.id
                  )
              )
              .map((benchPlayer, index) =>
                benchPlayer.data ? (
                  <li key={benchPlayer.id || index}>
                    <span className="font-semibold text-slate-600 mr-2">
                      {benchPlayer.data.position || "N/A"}:
                    </span>
                    <PlayerCard
                      key={benchPlayer.data.id || index}
                      player={benchPlayer.data}
                    />
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
      <div>
        <div className="flex flex-col relative pr-[40px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-gray-500 transition-transform">
              {selectedRoster?.username ||
                selectedRoster?.owner_id ||
                "Select Roster"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-700 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <div className="py-1">
                {otherRosters.length > 0 ? (
                  otherRosters.map((roster, index) => (
                    <button
                      key={roster?.username || `roster-${index}`}
                      onClick={() => handleRosterSelect(roster)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    >
                      {roster.username}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No other rosters found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
