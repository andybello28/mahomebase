const backend_url = process.env.NEXT_PUBLIC_API_URL;

const fetchAllLeagues = async (googleId) => {
  try {
    const res = await fetch(`${backend_url}/users/${googleId}/leagues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const leaguesData = await res.json();
    return leaguesData;
  } catch (error) {
    console.error("Error fetching league data:", error);
    throw error;
  }
};

const updateLeagues = async (googleId) => {
  try {
    const res = await fetch(`${backend_url}/users/${googleId}/leagues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Error updating league data:", error);
    throw error;
  }
};

const getLeague = async (googleId, leagueId) => {
  try {
    const res = await fetch(
      `${backend_url}/users/${googleId}/leagues/${leagueId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const league = res.json();
    return league;
  } catch (error) {
    console.error("Error fetching league:", error);
    throw error;
  }
};

const addLeague = async (googleId, leagueId) => {
  try {
    const res = await fetch(
      `${backend_url}/users/${googleId}/leagues/${leagueId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const message = await res.json();
    return message;
  } catch (error) {
    console.error("Error adding league:", error);
    throw error;
  }
};

export { fetchAllLeagues, updateLeagues, getLeague, addLeague };
