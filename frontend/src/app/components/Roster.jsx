"use client";

import PlayerCard from "../components/PlayerCard";

export default function Rosters({ roster, starters }) {
  return (
    <>
      <div
        key={roster.roster_id || idx}
        className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
      >
        <h2 className="text-lg font-bold mb-2">
          {roster.username || roster.owner_id}
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
                    <PlayerCard
                      key={benchPlayer.data.id || index}
                      player={benchPlayer.data}
                    />
                  </li>
                ) : (
                  <li key={benchPlayer.id || index}>
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
    </>
  );
}
