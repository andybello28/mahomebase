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
    <div className="flex flex-col gap-6 w-full px-6">
      <div className="self-end">
        <div className="flex flex-col relative pr-[40px] w-auto">
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
      <div className="flex flex-row gap-8">
        <Roster roster={userRoster} starters={starters} />

        <div
          key={selectedRoster?.roster_id}
          className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300 w-full max-w-4xl"
        >
          <h2 className="text-2xl font-bold mb-2 bg-black bg-clip-text text-transparent">
            {selectedRoster?.username || selectedRoster?.owner_id || "My Team"}
          </h2>

          <div className="text-sm text-gray-600 mb-6 font-medium">
            Record: {selectedRoster?.settings.wins} -{" "}
            {selectedRoster?.settings.losses}
            {selectedRoster?.settings.ties !== 1 &&
              ` - ${selectedRoster?.settings.ties}`}
          </div>

          {/* Starters Section */}
          <div className="mb-6">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Starters</h3>
            </div>
            <div className="space-y-2">
              {!selectedRoster?.starters ||
              selectedRoster?.starters.length === 0 ? (
                <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                  <span className="text-gray-500 font-medium text-lg">
                    Empty Roster
                  </span>
                </div>
              ) : (
                selectedRoster?.starters.map(({ id, data }, index) =>
                  data ? (
                    <PlayerCard key={id || index} player={data} />
                  ) : (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 transition-all duration-300"
                    >
                      <span className="font-semibold text-slate-600 min-w-[60px]">
                        {starters[index] || "N/A"}:
                      </span>
                      <span className="text-gray-500 font-medium">Empty</span>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          {/* Separator Line */}
          <hr className="border-gray-200 mb-6" />

          {/* Bench Section */}
          <div className="mb-3">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bench</h3>
            </div>
            <div className="space-y-2">
              {selectedRoster?.players && selectedRoster?.players.length > 0 ? (
                selectedRoster?.players
                  .filter(
                    (benchPlayer) =>
                      !selectedRoster?.starters.some(
                        (starter) => starter.id === benchPlayer.id
                      )
                  )
                  .map((benchPlayer, index) =>
                    benchPlayer.data ? (
                      <PlayerCard
                        key={benchPlayer.data.id || index}
                        player={benchPlayer.data}
                      />
                    ) : (
                      <div
                        key={benchPlayer.id || index}
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 transition-all duration-300"
                      >
                        <span className="font-semibold text-slate-600 min-w-[60px]">
                          {starter || "N/A"}:
                        </span>
                        <span className="text-gray-500 font-medium">Empty</span>
                      </div>
                    )
                  )
              ) : (
                <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                  <span className="text-gray-500 font-medium text-lg">
                    EMPTY
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
