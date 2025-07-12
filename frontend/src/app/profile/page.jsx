"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/auth";
import { linkSleeper, unlinkSleeper } from "../utils/sleeperUsername";
import { fetchAllLeagues } from "../utils/leagues";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import Footer from "../components/Footer";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";

import { GoLink, GoUnlink } from "react-icons/go";

export default function Users() {
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [sleeperUsername, setSleeperUsername] = useState("");
  const [showSleeperForm, setShowSleeperForm] = useState(false);

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [allLeagues, setAllLeagues] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);

  const handleFetchLeagues = async (year) => {
    setIsLoadingLeagues(true);
    try {
      const response = await fetchAllLeagues();
      if (response?.leagues) {
        setAllLeagues(response.leagues);
        setLeagues(response.leagues);
        console.log(response.leagues);
        const years = [];
        for (const league of response.leagues) {
          if (!years.includes(league.season)) {
            years.push(league.season);
          }
        }
        console.log(years);
        await setYears(years);
      } else {
        setAllLeagues([]);
        setLeagues([]);
      }
    } catch (error) {
      console.error("Error fetching leagues:", error);
      toast.error("Failed to fetch leagues");
      setLeagues([]);
    } finally {
      setIsLoadingLeagues(false);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year === "All") {
      setLeagues(allLeagues);
    } else {
      const filtered = allLeagues.filter((league) => league.season === year);
      setLeagues(filtered);
    }
  };

  useEffect(() => {
    console.log("leagues", leagues);
  }, [leagues]);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await fetchCurrentUser();
      if (currentUser && searchParams.get("login") == "success") {
        toast.success("Login Successful");
      }
      setUser(currentUser);
      if (currentUser.sleeper_username) {
        await handleFetchLeagues(selectedYear);
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  async function handleAddUsername(e) {
    e.preventDefault();

    if (!sleeperUsername.trim()) {
      toast.error("Please enter a sleeper username.");
      return;
    }

    try {
      const result = await linkSleeper(user.google_id, sleeperUsername.trim());

      if (result?.sleeper_username) {
        setUser((prev) => ({
          ...prev,
          sleeper_username: result.sleeper_username,
        }));
        toast.success("Sleeper Account Linked");
        // If we do not add this next part, then the leagues do not get automatically shown to refresh user session
        const updatedUser = await fetchCurrentUser();
        if (updatedUser?.sleeper_username) {
          setUser(updatedUser);
          await handleFetchLeagues(selectedYear);
        }
      } else {
        result?.message.map((e) => {
          toast.error(e);
        });
      }
      setSleeperUsername("");
    } catch (error) {
      console.error("Error in linkSleeper:", error);
      toast.error("Failed to link Sleeper.");
    }
  }

  async function handleDeleteUsername(e) {
    e.preventDefault();
    try {
      const result = await unlinkSleeper(user.google_id);
      if (result.sleeper_username == null) {
        setUser((prev) => ({
          ...prev,
          sleeper_username: null,
        }));
        toast.success("Sleeper account unlinked from Mahomebase");
        setLeagues([]);
      }
    } catch (error) {
      console.error("Error in unlinkedSleeper:", error);
      toast.error("Failed to unlink sleeper");
    }
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-start min-h-[100vh]">
      <Navbar />
      {user && (
        <div className="flex flex-grow flex-col gap-8 p-4 h-full w-full">
          {/* Top row with welcome text and leagues */}
          <div className="flex flex-row gap-4 h-1/3">
            <div className="flex flex-col justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 w-1/3">
              <span className="text-lg font-semibold text-[var(--foreground)] text-center">
                Welcome, {user.name}
              </span>
              {!user.sleeper_username && (
                <>
                  {!showSleeperForm && (
                    <button
                      onClick={() => setShowSleeperForm(true)}
                      className="flex items-center gap-3 py-3 px-6 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md w-full justify-center"
                    >
                      <img
                        src="/assets/sleeper.png"
                        alt="Sleeper logo"
                        className="w-6 h-6 object-contain"
                      />
                      Link Sleeper Account
                    </button>
                  )}
                  {showSleeperForm && (
                    <form
                      className="flex flex-col gap-3 bg-[var(--background)] border border-[var(--foreground)] text-[var(--foreground)] font-semibold p-4 rounded-lg w-full"
                      onSubmit={handleAddUsername}
                    >
                      <input
                        type="text"
                        value={sleeperUsername}
                        placeholder="Enter Sleeper Username"
                        onChange={(e) => setSleeperUsername(e.target.value)}
                        aria-label="Sleeper"
                        className="px-3 py-2 text-[var(--foreground)] bg-[var(--background)] border border-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-all duration-300"
                      />
                      <div className="flex gap-3 items-center justify-end">
                        <button
                          type="submit"
                          className="flex items-center justify-center flex-1 py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] font-semibold shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2"
                        >
                          <GoLink className="text-lg" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSleeperForm(false)}
                          className="px-4 py-2 rounded-md border border-[var(--foreground)] text-[var(--foreground)] font-medium transition-colors duration-200 hover:bg-[var(--foreground)] hover:text-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
              {user.sleeper_username && (
                <div className="flex items-center justify-between w-full mt-4 p-4 bg-[var(--background)] border border-[var(--foreground)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/sleeper.png"
                      alt="Sleeper logo"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-lg font-semibold text-[var(--foreground)]">
                      {user.sleeper_username}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      handleDeleteUsername(e);
                      setShowSleeperForm(false);
                    }}
                    className="flex items-center justify-center p-2 text-[var(--foreground)] hover:text-red-500 hover:scale-105 transition-all duration-300 rounded-lg border border-[var(--foreground)] hover:border-red-500"
                    aria-label="Delete sleeper username"
                  >
                    <GoUnlink className="w-4 h-4" />
                  </button>
                </div>
              )}
              <span className="text-sm text-[var(--foreground)] text-center ">
                Winning leagues with Mahomebase since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col gap-[3vh] items-center justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-2xl font-bold">My Leagues</span>
              {user.sleeper_username && (
                <>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <label
                      htmlFor="year-select"
                      className="text-sm font-medium text-[var(--foreground)]"
                    >
                      Select Year:
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="px-3 py-2 text-[var(--foreground)] bg-[var(--background)] border border-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-all duration-300"
                    >
                      <option value="All">All</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isLoadingLeagues && (
                    <div className="text-[var(--foreground)]">
                      Loading leagues...
                    </div>
                  )}

                  {!isLoadingLeagues && leagues.length > 0 && (
                    <div className="w-full max-h-40 overflow-y-auto">
                      {leagues.map((league, index) => (
                        <div
                          key={index}
                          className="p-2 border-b border-[var(--foreground)] last:border-b-0"
                        >
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {league.name || `League ${index + 1}`}
                          </div>
                          <div className="text-xs text-[var(--foreground)] opacity-75">
                            {league.rosters || 0} teams
                            <span> | {league.season}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingLeagues && leagues.length === 0 && (
                    <div className="text-[var(--foreground)] text-center">
                      No leagues found for {selectedYear}
                    </div>
                  )}
                </>
              )}
              {!user.sleeper_username && (
                <div className="text-[var(--foreground)] text-center opacity-75">
                  Link your Sleeper account to view leagues
                </div>
              )}
            </div>
          </div>

          {/* Bottom row with two equal boxes */}
          <div className="flex flex-row gap-4 h-1/3">
            <div className="flex flex-col items-center justify-center bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-xl font-semibold text-[var(--foreground)]">
                Stats
              </span>
              {!user.sleeper_username && (
                <div className="text-[var(--foreground)] text-center opacity-75">
                  Link your Sleeper account to view leagues
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-between bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-xl font-semibold text-[var(--foreground)]">
                Recent Activity
              </span>
              {!user.sleeper_username && (
                <div className="text-[var(--foreground)] text-center opacity-75">
                  Link your Sleeper account to view leagues
                </div>
              )}
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
