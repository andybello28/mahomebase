const addLeague = async (inputLeague) => {
  try {
    const res = await fetch("http://localhost:4000/user/leagues/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        leagueId: inputLeague,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error();
  }
};

const deleteLeague = async (leagueId) => {
  try {
    const res = await fetch("http://localhost:4000/user/leagues/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        leagueId: leagueId,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error();
  }
};

export { addLeague, deleteLeague };
