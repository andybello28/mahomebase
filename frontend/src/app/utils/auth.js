const fetchCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:4000/auth/user", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("User not authenticated");

    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
};

export { fetchCurrentUser };
