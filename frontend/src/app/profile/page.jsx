"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/auth";
import { addLeague } from "../utils/league";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import Footer from "../components/Footer";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";

export default function Users() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //Used for ui experience with the form for entering league id
  const [leagueId, setLeagueId] = useState("");

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await fetchCurrentUser();
      if (currentUser && searchParams.get("login") == "success") {
        toast.success("Login Successful");
      }
      setUser(currentUser);
      setIsLoading(false);
    };
    getUser();
  }, []);

  async function handleAddLeague(e) {
    e.preventDefault();
    console.log("FORM SUBMITTED");

    if (!leagueId.trim()) {
      toast.error("Please enter a league ID.");
      return;
    }

    try {
      const result = await addLeague(leagueId.trim());
      console.log("Server response:", result);

      if (result?.leagues) {
        setUser((prev) => ({
          ...prev,
          leagues: result.leagues,
        }));
        toast.success("League Created");
      } else {
        result?.message.map((e) => {
          toast.error(e);
        });
      }
      setLeagueId("");
    } catch (error) {
      console.error("Error in handleAddLeague:", error);
      toast.error("Failed to add league.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[100vh]">
      <Navbar />
      {user && (
        <div className="flex flex-grow flex-col gap-8 p-4 h-full w-full">
          {/* Top row with welcome text and leagues */}
          <div className="flex flex-row gap-4 h-1/3">
            <div className="flex flex-col justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 w-1/3">
              <span className="text-lg font-semibold text-[var(--foreground)] text-center">
                Welcome, {user.name}
              </span>
              <span className="text-sm text-[var(--foreground)] text-center ">
                Winning leagues with Mahomebase since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col gap-[3vh] items-center justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-2xl font-bold">My Leagues</span>
              {user.leagues.map((e, index) => (
                <span key={index}>{e}</span>
              ))}
              <form
                className="flex flex-col bg-[var(--background)] border border-[var(--foreground)] text-[var(--foreground)] font-semibold px-6 py-3 rounded-lg"
                onSubmit={handleAddLeague}
              >
                <input
                  type="text"
                  value={leagueId}
                  placeholder="Sleeper League ID"
                  onChange={(e) => setLeagueId(e.target.value)}
                  aria-label="Sleeper League ID"
                  className="mb-2 px-2 py-1 text-[var(--foreground)] focus-none"
                />
                <button
                  type="submit"
                  className="py-2 rounded bg-[var(--foreground)] text-[var(--background)] transition-colors duration-300"
                >
                  Add League
                </button>
              </form>
            </div>
          </div>

          {/* Bottom row with two equal boxes */}
          <div className="flex flex-row gap-4 h-1/3">
            <div className="flex items-center justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-xl font-semibold text-[var(--foreground)]">
                Stats
              </span>
            </div>
            <div className="flex items-center justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-xl font-semibold text-[var(--foreground)]">
                Recent Activity
              </span>
            </div>
          </div>

          {/* logout button */}
          <div className="flex justify-center items-center h-1/3">
            <Logout />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
