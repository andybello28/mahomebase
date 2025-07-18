const backend_url = process.env.NEXT_PUBLIC_API_URL;

const fetchTrendingPlayers = async () => {
  try {
    // Returns an array of players
    const res = await fetch(`${backend_url}/nfl/players/trending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const players = await res.json();
    return players;
  } catch (error) {
    console.error("Error fetching league data:", error);
    throw error;
  }
};

const getPlayer = async (player_id) => {
  try {
    const res = await fetch(`${backend_url}/nfl/players/${player_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const player_data = await res.json();
    return player_data;
  } catch (error) {
    console.error(`Error getting player data. Player ${player_id}: `, error);
    throw error;
  }
};

export { fetchTrendingPlayers, getPlayer };
