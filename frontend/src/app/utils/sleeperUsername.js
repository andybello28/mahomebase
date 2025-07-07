const linkSleeper = async (inputUsername) => {
  try {
    const res = await fetch("http://localhost:4000/user/link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        sleeperUsername: inputUsername,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error linking sleeper username:", error);
  }
};

const unlinkSleeper = async () => {
  try {
    const res = await fetch("http://localhost:4000/user/unlink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error unlinking sleeper username:", error);
  }
};

export { linkSleeper, unlinkSleeper };
