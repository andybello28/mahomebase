const backend_url = process.env.NEXT_PUBLIC_API_URL;

const fetchAllLeagues = async (season) => {
  try {
    const res = await fetch(`${backend_url}/leagues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        season: season,
      }),
    });
    const leaguesData = await res.json();
    console.log(leaguesData);
    return leaguesData;
  } catch (error) {
    console.error("Error fetching league data:", error);
    throw error;
  }
};

export { fetchAllLeagues };
