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

export { fetchAllLeagues };
