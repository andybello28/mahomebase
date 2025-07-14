const backend_url = process.env.NEXT_PUBLIC_API_URL;

const getRound = async () => {
  try {
    const res = await fetch(`${backend_url}/nfl/season`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const seasonData = await res.json();
    return seasonData;
  } catch (error) {
    console.error("Error fetching season data:", error);
    throw error;
  }
};

export { getRound };
