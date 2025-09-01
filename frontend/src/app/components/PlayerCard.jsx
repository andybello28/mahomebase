export default function PlayerCard({ player }) {
  return (
    <div className="p-5 rounded-xl bg-gray-50 transition-all duration-300 cursor-pointer height-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm overflow-hidden">
            {player.headshot ? (
              <img
                src={player.headshot}
                alt={`${player.first_name} ${player.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              `${player.first_name[0]}${player.last_name[0]}`
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {player.first_name} {player.last_name}
            </h3>
            <p className="text-sm text-gray-600">{player.college}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
            {player.team}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Position:</span>
            <span className="text-sm font-medium text-gray-800 bg-red-100 px-2 py-1 rounded-full">
              {player.position}
            </span>
          </div>
          {player.age && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Age:</span>
              <span className="text-sm font-medium text-gray-800">
                {player.age}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {player.years_exp == null
              ? ""
              : player.years_exp === 0
              ? "Rookie"
              : `${player.years_exp} yr${player.years_exp > 1 ? "s" : ""}`}
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              player.status === "Active" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
