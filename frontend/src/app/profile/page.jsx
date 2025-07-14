"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/auth";
import { linkSleeper, unlinkSleeper } from "../utils/sleeperUsername";
import { fetchAllLeagues, updateLeagues } from "../utils/leagues";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { getRound } from "../utils/round";
import { fetchTransactions } from "../utils/transactions";

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

  const [season, setSeason] = useState(null);
  const [week, setWeek] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  useEffect(() => {
    console.log("user", user);
    console.log("transactions: ", transactions);
    console.log("is loading:", isLoadingTransactions);
  }, [transactions, isLoadingTransactions, user]);

  useEffect(() => {
    const fetchRound = async () => {
      const roundData = await getRound();
      setSeason(roundData.season);
      setWeek(roundData.week);
    };
    fetchRound();
  }, []);

  const handleFetchLeagues = async () => {
    setIsLoadingLeagues(true);
    try {
      const googleId = user?.google_id;
      await updateLeagues(googleId);
      const response = await fetchAllLeagues(googleId);
      if (response?.leagues) {
        setAllLeagues(response.leagues);
        setLeagues(response.leagues);
        const years = [];
        for (const league of response.leagues) {
          if (!years.includes(league.season)) {
            years.push(league.season);
          }
        }
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

  const handleFetchTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const googleId = user?.google_id;
      const transactions = await fetchTransactions(googleId);
      setTransactions(transactions);
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions from sleeper");
      return [];
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await fetchCurrentUser();
      if (currentUser && searchParams.get("login") == "success") {
        toast.success("Login Successful");
      }
      setUser(currentUser);
      if (currentUser.sleeper_username) {
        await handleFetchLeagues();
        await handleFetchTransactions();
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  async function handleAddUsername(e) {
    e.preventDefault();
    console.log("We here");
    if (!sleeperUsername.trim()) {
      toast.error("Please enter a sleeper username.");
      return;
    }

    try {
      const googleId = user?.google_id;
      const result = await linkSleeper(googleId, sleeperUsername.trim());

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
          await handleFetchLeagues();
          await handleFetchTransactions();
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
      const googleId = user?.google_id;
      const result = await unlinkSleeper(googleId);
      if (result.sleeper_username == null) {
        setUser((prev) => ({
          ...prev,
          sleeper_username: null,
        }));
        setLeagues([]);
        setTransactions([]);
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Loading leagues...
                      </span>
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
                  Link your Sleeper account to view
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-between bg-[var(--background)] border border-[var(--foreground)] rounded-lg p-4 flex-1">
              <span className="text-xl font-semibold text-[var(--foreground)]">
                Recent Activity
              </span>
              {user.sleeper_username && (
                <>
                  {isLoadingTransactions && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Loading transactions...
                      </span>
                    </div>
                  )}
                  {!isLoadingTransactions && transactions.length > 0 && (
                    <div className="w-full space-y-3 max-h-96 overflow-y-auto">
                      {transactions.map((tx, index) => (
                        <div
                          key={tx.id || index}
                          className="p-4 rounded-lg bg-white text-black border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">
                                Type:
                              </span>
                              <span className="ml-2 capitalize">{tx.type}</span>
                            </div>

                            <div>
                              <span className="font-semibold text-gray-700">
                                Status:
                              </span>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  tx.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : tx.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {tx.status}
                              </span>
                            </div>

                            <div>
                              <span className="font-semibold text-gray-700">
                                Roster ID:
                              </span>
                              <span className="ml-2 font-mono text-xs">
                                {tx.roster_ids?.join(", ") || "N/A"}
                              </span>
                            </div>

                            <div>
                              <span className="font-semibold text-gray-700">
                                Updated:
                              </span>
                              <span className="ml-2">
                                {tx.status_updated
                                  ? new Date(tx.status_updated).toLocaleString(
                                      undefined,
                                      {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      }
                                    )
                                  : "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isLoadingTransactions &&
                    user.sleeper_username &&
                    transactions.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          No recent transactions
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Transaction history will appear here
                        </p>
                      </div>
                    )}
                </>
              )}
              {!user.sleeper_username && (
                <div className="text-[var(--foreground)] text-center opacity-75">
                  Link your Sleeper account to view
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
