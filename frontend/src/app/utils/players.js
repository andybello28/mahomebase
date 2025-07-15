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

export { fetchTrendingPlayers };
