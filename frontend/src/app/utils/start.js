const backend_url = process.env.NEXT_PUBLIC_API_URL;

const startSit = async (leagueid) => {
  try {
    const res = await fetch(
      `${backend_url}/recommendations/lineup/${leagueid}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error("Start/Sit API error:", res.status);
      return { output: { swaps: [], explanation: "Failed to fetch data." } };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error generating start/sit advice:", error);
    return { output: { swaps: [], explanation: "Error fetching data." } };
  }
};

export { startSit };
