const backend_url = process.env.NEXT_PUBLIC_API_URL;

const fetchTransactions = async (googleId) => {
  try {
    const res = await fetch(
      `${backend_url}/users/${googleId}/leagues/transactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const transactions = await res.json();
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export { fetchTransactions };
