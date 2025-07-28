"use client";

import { useState, useEffect } from "react";
import { linkSleeper, unlinkSleeper } from "../utils/sleeperUsername";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import {
  useUser,
  useLeagues,
  useSeason,
  useTransactions,
  useTrendingPlayers,
} from "../context/Context.jsx";

import Login from "../components/Login";
import Footer from "../components/Footer";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";

import { useRouter } from "next/navigation";
import { getPlayer } from "../utils/players";

import { fetchAllLeagues } from "../utils/leagues";
import { fetchTransactions } from "../utils/transactions";
import { MdAddLink, MdLinkOff } from "react-icons/md";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, setUser, setSleeperUsername, sleeperId, setSleeperId } =
    useUser();
  const { allLeagues, isLoadingLeagues } = useLeagues();
  const { season, week } = useSeason();
  const { transactions, setTransactions, isLoadingTransactions } =
    useTransactions();
  const { trendingPlayers, isLoadingTrendingPlayers } = useTrendingPlayers();
  const [searchTerm, setSearchTerm] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showSleeperForm, setShowSleeperForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All");
  const [leagues, setLeagues] = useState([]);
  const [inputSleeperUsername, setInputSleeperUsername] = useState("");
  const [fetchedPlayers, setFetchedPlayers] = useState({});

  useEffect(() => {
    if (user && searchParams.get("login") == "success") {
      toast.success("Login Successful");
    }
  }, [user?.google_id]);

  useEffect(() => {
    const filtered = allLeagues.filter((league) =>
      league.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setLeagues(filtered);
  }, [searchTerm, allLeagues]);

  useEffect(() => {
    setLeagues(allLeagues);
  }, [allLeagues]);

  //Fetches the players from our transactions so they can be displayed
  useEffect(() => {
    const fetchPlayers = async () => {
      const playerPromises = [];

      transactions.forEach((tx) => {
        if (tx.adds) {
          Object.entries(tx.adds).forEach(([playerId]) => {
            // Push a promise that resolves to an object with playerId and playerData
            playerPromises.push(
              getPlayer(playerId).then((playerData) => ({
                playerId,
                playerData,
              }))
            );
          });
        }
        if (tx.drops) {
          Object.entries(tx.drops).forEach(([playerId]) => {
            playerPromises.push(
              getPlayer(playerId).then((playerData) => ({
                playerId,
                playerData,
              }))
            );
          });
        }
      });
      const playerResults = await Promise.all(playerPromises);
      setFetchedPlayers(playerResults);
    };

    if (transactions.length > 0) {
      fetchPlayers();
    }
  }, [transactions]);

  async function handleAddUsername(e) {
    e.preventDefault();
    if (!inputSleeperUsername.trim()) {
      toast.error("Please enter a sleeper username.");
      return;
    }

    try {
      setIsLoading(true); // Add loading state
      const googleId = user?.google_id;
      const result = await linkSleeper(googleId, inputSleeperUsername.trim());

      if (result?.sleeper_username) {
        setSleeperUsername(result.sleeper_username);
        setSleeperId(result.sleeper_id);
        setUser((prev) => ({
          ...prev,
          sleeper_username: result.sleeper_username,
          sleeper_id: result.sleeper_id,
        }));

        // Fetch leagues and transactions
        const leaguesData = await fetchAllLeagues(googleId);
        const transactionsData = await fetchTransactions(googleId);

        // Set leagues first
        setLeagues(leaguesData.leagues || []);

        // Set transactions - this will trigger the player fetching effect
        setTransactions(transactionsData);

        // Give the transactions state update time to trigger the player fetch effect
        // The useEffect that fetches players will handle the player data

        toast.success("Sleeper Account Linked");
      } else {
        result?.message.map((e) => {
          toast.error(e);
        });
      }
      setInputSleeperUsername("");
    } catch (error) {
      console.error("Error in linkSleeper:", error);
      toast.error("Failed to link Sleeper.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteUsername(e) {
    e.preventDefault();
    try {
      const googleId = user?.google_id;
      if (!googleId) {
        toast.error("User not logged in");
        return;
      }
      const result = await unlinkSleeper(googleId);
      if (result.sleeper_username == null) {
        setUser((prev) => ({
          ...prev,
          sleeper_username: null,
          sleeper_id: null,
        }));
        setLeagues([]);
        setTransactions([]);
        setSleeperId("");
        setSleeperUsername("");
        toast.success("Sleeper account unlinked from Mahomebase");
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
                        value={inputSleeperUsername}
                        placeholder="Enter Sleeper Username"
                        onChange={(e) =>
                          setInputSleeperUsername(e.target.value)
                        }
                        aria-label="Sleeper"
                        className="px-3 py-2 text-[var(--foreground)] bg-[var(--background)] border border-[var(--foreground)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] transition-all duration-300"
                      />
                      <div className="flex gap-3 items-center justify-end">
                        <button
                          type="submit"
                          className="flex items-center justify-center flex-1 py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] font-semibold shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2"
                        >
                          <MdAddLink />
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
                    <MdLinkOff />
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
                  <span className="text-xl font-bold text-slate-800 bg-gradient-to-r mb-2 from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {week === 0 && <>Preseason {season}</>}
                    {week !== 0 && (
                      <>
                        Week {week} {season}
                      </>
                    )}
                  </span>
                  {isLoadingLeagues && (
                    <div className="text-[var(--foreground)]">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Loading leagues...
                      </span>
                    </div>
                  )}

                  {!isLoadingLeagues && allLeagues.length > 0 && (
                    <div className="w-full max-h-40 overflow-y-auto">
                      <input
                        type="text"
                        placeholder="Search leagues..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
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
                          <button
                            onClick={() => {
                              router.push(
                                `/profile/leagues/${league.league_id}`
                              );
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow hover:brightness-110 transition-all"
                          >
                            More
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingLeagues && leagues.length === 0 && (
                    <div className="text-[var(--foreground)] text-center">
                      No leagues found
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

          <div className="flex flex-row gap-6 h-1/3">
            <div className="flex flex-col items-center justify-around bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 flex-1 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="text-2xl font-bold text-slate-800 bg-gradient-to-r mb-2 from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trending Waiver Wire Adds On Sleeper
              </span>

              {user.sleeper_username && (
                <>
                  {isLoadingTrendingPlayers && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                      <span className="ml-3 text-sm text-slate-600 font-medium">
                        Loading Trending Players...
                      </span>
                    </div>
                  )}

                  {!isLoadingTrendingPlayers && trendingPlayers.length > 0 && (
                    <div className="w-full space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                      {trendingPlayers
                        .filter(
                          (player) => player?.first_name && player?.last_name
                        )
                        .map((player, index) => (
                          <div
                            key={player.id || index}
                            className="p-5 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {player.first_name[0]}
                                  {player.last_name[0]}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-lg">
                                    {player.first_name} {player.last_name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {player.college}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                  {player.team}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    Position:
                                  </span>
                                  <span className="text-sm font-medium text-gray-700 bg-blue-100 px-2 py-1 rounded-full">
                                    {player.position}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    Age:
                                  </span>
                                  <span className="text-sm font-medium text-gray-700">
                                    {player.age}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-500">
                                  {player.years_exp === 0
                                    ? "Rookie"
                                    : `${player.years_exp} yr${
                                        player.years_exp > 1 ? "s" : ""
                                      }`}
                                </div>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    player.status === "Active"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200/60">
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{index + 1}</span>
                                <span>
                                  Fantasy Eligible:{" "}
                                  {player.fantasy_positions.join(", ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {!isLoadingTrendingPlayers &&
                    trendingPlayers.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 shadow-sm">
                          <svg
                            className="w-8 h-8 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <p className="text-base text-slate-600 font-semibold">
                          No trending players
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Trending players will appear here
                        </p>
                      </div>
                    )}
                </>
              )}

              {!user.sleeper_username && (
                <div className="text-slate-600 text-center opacity-75 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  Link your Sleeper account to view trending players
                </div>
              )}
            </div>

            {/* Right side - Recent Activity */}
            <div className="flex flex-col items-center justify-around bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 flex-1 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="text-2xl font-bold text-slate-800 bg-gradient-to-r mb-2 from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recent Activity
              </span>

              {user.sleeper_username && (
                <>
                  <span className="text-xl font-bold text-slate-800 bg-gradient-to-r mb-2 from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {week === 0 && <>Preseason {season}</>}
                    {week !== 0 && (
                      <>
                        Week {week} {season}
                      </>
                    )}
                  </span>

                  {isLoadingTransactions && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
                      <span className="ml-3 text-sm text-slate-600 font-medium">
                        Loading transactions...
                      </span>
                    </div>
                  )}

                  {!isLoadingTransactions && transactions.length > 0 && (
                    <div className="w-full space-y-4 max-h-96 overflow-y-auto custom-scrollbar px-4 py-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.transaction_id}
                          className="p-5 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          <p className="text-sm text-gray-600 font-semibold">
                            Type:{" "}
                            <span
                              className={`ml-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                tx.type === "free_agent"
                                  ? "bg-blue-100 text-blue-800"
                                  : tx.type === "waiver"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {tx.type === "free_agent"
                                ? "free agent"
                                : tx.type}
                            </span>
                          </p>

                          {(tx.type === "free_agent" ||
                            tx.type === "waiver") && (
                            <>
                              {tx.adds && (
                                <div className="mt-2 text-sm text-green-700">
                                  <p className="font-semibold">+:</p>
                                  <ul className="list-disc list-inside">
                                    {Object.entries(tx.adds).map(
                                      ([playerId]) => {
                                        const playerObj = Array.isArray(
                                          fetchedPlayers
                                        )
                                          ? fetchedPlayers.find(
                                              (p) => p.playerId === playerId
                                            )
                                          : null;

                                        const playerName = playerObj
                                          ? `${playerObj.playerData.first_name} ${playerObj.playerData.last_name}`
                                          : "Loading...";

                                        return (
                                          <li key={playerId}>{playerName}</li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                              )}

                              {tx.drops && (
                                <div className="mt-2 text-sm text-red-700">
                                  <p className="font-semibold">-</p>
                                  <ul className="list-disc list-inside">
                                    {Object.entries(tx.drops).map(
                                      ([playerId]) => {
                                        const playerObj = Array.isArray(
                                          fetchedPlayers
                                        )
                                          ? fetchedPlayers.find(
                                              (p) => p.playerId === playerId
                                            )
                                          : null;

                                        const playerName = playerObj
                                          ? `${playerObj.playerData.first_name} ${playerObj.playerData.last_name}`
                                          : "Loading...";

                                        return (
                                          <li key={playerId}>{playerName}</li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                              )}
                            </>
                          )}

                          {tx.type === "trade" && (
                            <>
                              {tx.adds && (
                                <div className="mt-2 text-sm text-green-700">
                                  <p className="font-semibold">+:</p>
                                  <ul className="list-disc list-inside">
                                    {Object.entries(tx.adds)
                                      .filter(([playerId, rosterId]) => {
                                        const roster =
                                          tx.league_data?.roster_data?.[
                                            rosterId - 1
                                          ];
                                        return (
                                          roster?.owner_id === user?.sleeper_id
                                        );
                                      })
                                      .map(([playerId, rosterId]) => {
                                        const playerObj = Array.isArray(
                                          fetchedPlayers
                                        )
                                          ? fetchedPlayers.find(
                                              (p) => p.playerId === playerId
                                            )
                                          : null;

                                        const playerName = playerObj
                                          ? `${playerObj.playerData.first_name} ${playerObj.playerData.last_name}`
                                          : "Loading...";

                                        return (
                                          <li key={playerId}>{playerName}</li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              )}

                              {tx.drops && (
                                <div className="mt-2 text-sm text-red-700">
                                  <p className="font-semibold">-</p>
                                  <ul className="list-disc list-inside">
                                    {Object.entries(tx.drops)
                                      .filter(([playerId, rosterId]) => {
                                        const roster =
                                          tx.league_data?.roster_data?.[
                                            rosterId - 1
                                          ];
                                        return (
                                          roster?.owner_id === user.sleeper_id
                                        );
                                      })
                                      .map(([playerId, rosterId]) => {
                                        const playerObj = Array.isArray(
                                          fetchedPlayers
                                        )
                                          ? fetchedPlayers.find(
                                              (p) => p.playerId === playerId
                                            )
                                          : null;

                                        const playerName = playerObj
                                          ? `${playerObj.playerData.first_name} ${playerObj.playerData.last_name}`
                                          : "Loading...";

                                        return (
                                          <li key={playerId}>{playerName}</li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              )}

                              <ul>
                                {tx.draft_picks.map((pick, index) => {
                                  const acquired =
                                    pick.owner_id === user.sleeper_id;
                                  const gaveUp =
                                    pick.previous_owner_id === user.sleeper_id;

                                  if (acquired) {
                                    return (
                                      <li key={index}>
                                        <b>Acquired</b> Pick: Round {pick.round}
                                        , {pick.season}
                                      </li>
                                    );
                                  }
                                  if (gaveUp) {
                                    return (
                                      <li key={index}>
                                        <b>Gave Up</b> Pick: Round {pick.round},{" "}
                                        {pick.season}
                                      </li>
                                    );
                                  }
                                })}
                              </ul>
                            </>
                          )}

                          <p>Status: {tx.status}</p>

                          <p className="text-sm text-slate-500">
                            League: <strong>{tx.league_data.name}</strong>
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">Updated:</span>{" "}
                            {tx.status_updated
                              ? new Date(tx.status_updated).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!isLoadingTransactions &&
                    !isLoadingLeagues &&
                    user.sleeper_username &&
                    transactions.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 shadow-sm">
                          <svg
                            className="w-8 h-8 text-slate-400"
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
                        <p className="text-base text-slate-600 font-semibold">
                          No recent transactions
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                          Transaction history will appear here
                        </p>
                      </div>
                    )}
                </>
              )}

              {!user.sleeper_username && (
                <div className="text-slate-600 text-center opacity-75 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  Link your Sleeper account to view recent activity
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
      {!user && (
        <>
          <div>Please Log In</div>
          <Login />
        </>
      )}
      <Footer />
    </div>
  );
}
