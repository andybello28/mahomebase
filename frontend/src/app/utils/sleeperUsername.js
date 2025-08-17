const backend_url = process.env.NEXT_PUBLIC_API_URL;

const linkSleeper = async (googleId, inputUsername) => {
  try {
    const res = await fetch(`${backend_url}/users/${googleId}/sleeper`, {
      method: "PUT",
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
    const res = await fetch(`${backend_url}/users/${googleId}/sleeper`, {
      method: "DELETE",
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

const getSleeperUsername = async (sleeper_id) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${sleeper_id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${sleeper_id}`);
    }

    const data = await response.json();
    return data.username;
  } catch (error) {
    console.error("Error fetching Sleeper username:", error);
    return null;
  }
};

export { linkSleeper, unlinkSleeper, getSleeperUsername };
