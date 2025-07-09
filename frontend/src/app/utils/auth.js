const backend_url = process.env.NEXT_PUBLIC_API_URL;

const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${backend_url}/auth/user`, {
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
