const backend_url = process.env.NEXT_PUBLIC_API_URL;

const linkSleeper = async (googleId, inputUsername) => {
  try {
    const res = await fetch(`${backend_url}/users/${googleId}/link`, {
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

const unlinkSleeper = async (googleId) => {
  try {
    const res = await fetch(`${backend_url}/users/${googleId}/unlink`, {
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
