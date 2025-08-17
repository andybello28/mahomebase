const backend_url = process.env.NEXT_PUBLIC_API_URL;

const generateTrade = async (leagueid, owner_id) => {
  try {
    const res = await fetch(
      `${backend_url}/recommendations/trade/${leagueid}/${owner_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error generating trade:", error);
  }
};

export { generateTrade };
