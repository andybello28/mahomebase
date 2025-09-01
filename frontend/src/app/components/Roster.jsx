"use client";

import PlayerCard from "../components/PlayerCard";

export default function Rosters({ roster, starters }) {
  if (!roster) {
    return;
  }
  return (
    <>
      <div
        key={roster.roster_id || idx}
        className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-2 bg-black bg-clip-text text-transparent">
          {roster.username || roster.owner_id}
        </h2>

        <div className="text-sm text-gray-600 mb-6 font-medium">
          Record: {roster.settings.wins} - {roster.settings.losses}
          {roster.settings.ties !== 1 && ` - ${roster.settings.ties}`}
        </div>

        {/* Starters Section */}
        <div className="mb-6">
          <div className="border-b border-gray-200 pb-2 mb-4 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Starters</h3>
          </div>
          <div className="space-y-2">
            {!roster.starters || roster.starters.length === 0 ? (
              <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-gray-500 font-medium text-lg">EMPTY</span>
              </div>
            ) : (
              roster.starters.map(({ id, data }, index) =>
                data ? (
                  <div key={id || index}>
                    <PlayerCard key={id || index} player={data} />
                  </div>
                ) : (
                  <div key={index}>
                    <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-lg">
                        EMPTY
                      </span>
                    </div>
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
            {roster.players && roster.players.length > 0 ? (
              roster.players
                .filter(
                  (benchPlayer) =>
                    !roster.starters.some(
                      (starter) => starter.id === benchPlayer.id
                    )
                )
                .map((benchPlayer, index) =>
                  benchPlayer.data ? (
                    <div key={benchPlayer.id || index}>
                      <PlayerCard
                        key={benchPlayer.data.id || index}
                        player={benchPlayer.data}
                      />
                    </div>
                  ) : (
                    <div key={benchPlayer.id || index}>
                      <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                        <span className="text-gray-500 font-medium text-lg">
                          EMPTY
                        </span>
                      </div>
                    </div>
                  )
                )
            ) : (
              <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-gray-500 font-medium text-lg">EMPTY</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
