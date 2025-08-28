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
import PlayerCard from "../components/PlayerCard";
import Roster from "../components/Roster";

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
  const [isLoadingFetchPlayers, setIsLoadingFetchPlayers] = useState(true);

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
      setIsLoadingFetchPlayers(false);
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

        const [leaguesData, transactionsData] = await Promise.all([
          fetchAllLeagues(googleId),
          fetchTransactions(googleId),
        ]);

        setLeagues(leaguesData.leagues || []);

        setTransactions(transactionsData);

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
        setIsLoadingFetchPlayers(true);
        toast.success("Sleeper account unlinked from Mahomebase");
      }
    } catch (error) {
      console.error("Error in unlinkedSleeper:", error);
      toast.error("Failed to unlink sleeper");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="px-4">
        {user && (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-8">
              <div className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300">
                <div className="text-center items-center justify-start space-y-6">
                  <h2 className="text-3xl font-extrabold text-black mb-2">
                    Welcome {user.name}!
                  </h2>

                  {!user.sleeper_username && (
                    <>
                      {!showSleeperForm && (
                        <button
                          onClick={() => setShowSleeperForm(true)}
                          className="flex items-center gap-3 py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-transform duration-300 hover:scale-105 max-w-xs mx-auto justify-center"
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
                          className="w-full max-w-md mx-auto space-y-4"
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
                            className="w-full px-4 py-3 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                          />

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="flex-1 flex items-center justify-center py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-transform duration-300 hover:scale-105"
                            >
                              <MdAddLink />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowSleeperForm(false)}
                              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </>
                  )}

                  {user.sleeper_username && (
                    <div className="mb-2 bg-gray-50 flex items-center justify-between w-full max-w-md mx-auto p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/sleeper.png"
                          alt="Sleeper logo"
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-lg font-semibold text-black">
                          {user.sleeper_username}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          handleDeleteUsername(e);
                          setShowSleeperForm(false);
                        }}
                        className="flex items-center justify-center p-2 text-gray-600 hover:text-red-500 hover:scale-110 transition-transform duration-300 rounded-lg"
                        aria-label="Delete sleeper username"
                      >
                        <MdLinkOff />
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 italic mt-0">
                    Winning leagues with Mahomebase since{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-[#ffffff] rounded-2xl p-8 transition-all duration-300">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-extrabold text-black mb-2">
                    My Leagues
                  </h2>

                  {user.sleeper_username && (
                    <>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                        {week === 0 && <>Preseason {season}</>}
                        {week !== 0 && (
                          <>
                            Week {week} {season}
                          </>
                        )}
                      </h3>

                      {isLoadingLeagues && (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></div>
                          <span className="ml-3 text-sm text-gray-600 font-medium">
                            Loading leagues...
                          </span>
                        </div>
                      )}

                      {!isLoadingLeagues && allLeagues.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Search leagues..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="flex-1 px-4 py-3 text-black placeholder-gray-400 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                            />
                            <button
                              onClick={() => router.push("/profile/leagues")}
                              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold transition-transform duration-300"
                            >
                              View All
                            </button>
                          </div>

                          <div className="max-h-40 overflow-y-auto space-y-3">
                            {leagues.map((league, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-xl bg-gray-50 transition-colors duration-300 flex flex-col text-left"
                              >
                                <div className="font-semibold text-black">
                                  {league.name || `League ${index + 1}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {league.rosters || 0} teams | {league.season}{" "}
                                  | Sleeper
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isLoadingLeagues && leagues.length === 0 && (
                        <div className="text-gray-600 py-8 italic">
                          No leagues found
                        </div>
                      )}
                    </>
                  )}

                  {!user.sleeper_username && (
                    <div className="text-gray-700 py-8 bg-gray-50 rounded-xl italic">
                      Link your Sleeper account to view leagues
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Trending Players - Takes 1/3 of width */}
              <div className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300">
                <div className="text-center space-y-8">
                  <h2 className="mb-2 text-2xl font-bold bg-black bg-clip-text text-transparent">
                    Trending Waiver Wire Adds On Sleeper
                  </h2>

                  {user.sleeper_username && (
                    <>
                      {isLoadingTrendingPlayers && (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></div>
                          <span className="ml-3 text-sm text-gray-600 font-medium">
                            Loading Trending Players...
                          </span>
                        </div>
                      )}

                      {!isLoadingTrendingPlayers &&
                        trendingPlayers.length > 0 && (
                          <div className="space-y-6 max-h-96 overflow-y-auto">
                            {trendingPlayers
                              .filter(
                                (player) =>
                                  player?.first_name && player?.last_name
                              )
                              .map((player, index) => (
                                <PlayerCard
                                  key={player.id || index}
                                  player={player}
                                />
                              ))}
                          </div>
                        )}

                      {!isLoadingTrendingPlayers &&
                        trendingPlayers.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                              <svg
                                className="w-8 h-8 text-red-600"
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
                            <p className="text-lg font-semibold text-gray-900 mb-3">
                              No trending players
                            </p>
                            <p className="text-sm text-gray-600">
                              Trending players will appear here
                            </p>
                          </div>
                        )}
                    </>
                  )}

                  {!user.sleeper_username && (
                    <div className="text-gray-600 py-12 bg-gray-50 rounded-lg">
                      Link your Sleeper account to view trending players
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity - Takes 2/3 of width */}
              <div className="bg-[#ffffff] rounded-2xl p-8 transition-all duration-300 md:col-span-2">
                <div className="text-center space-y-8">
                  <h2 className="text-2xl font-bold bg-black bg-clip-text text-transparent mb-2">
                    Recent Activity
                  </h2>

                  {user.sleeper_username && (
                    <>
                      <h3 className="mb-2 text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                        {week === 0 && <>Preseason {season}</>}
                        {week !== 0 && (
                          <>
                            Week {week} {season}
                          </>
                        )}
                      </h3>

                      {isLoadingTransactions && (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></div>
                          <span className="ml-3 text-sm text-gray-600 font-medium">
                            Loading transactions...
                          </span>
                        </div>
                      )}

                      {!isLoadingTransactions &&
                        !isLoadingFetchPlayers &&
                        transactions.length > 0 && (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {transactions.map((tx) => (
                              <div
                                key={tx.transaction_id}
                                className="bg-white px-5 py-4 border border-gray-50 rounded-2xl"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        tx.type === "free_agent"
                                          ? "bg-green-100 text-green-800"
                                          : tx.type === "waiver"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : tx.type === "trade"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {tx.type === "free_agent"
                                        ? "free agent"
                                        : tx.type}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      {tx.status}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {tx.status_updated
                                      ? new Date(
                                          tx.status_updated
                                        ).toLocaleString()
                                      : "Unknown"}
                                  </span>
                                </div>

                                <div className="text-sm text-gray-700 mb-2">
                                  <span className="font-semibold">League:</span>{" "}
                                  {tx.league_data.name}
                                </div>

                                {(tx.type === "free_agent" ||
                                  tx.type === "waiver") && (
                                  <>
                                    {tx.adds && (
                                      <div className="mb-2">
                                        <p className="text-sm font-semibold text-green-700 mb-1">
                                          Added:
                                        </p>
                                        <div className="space-y-1">
                                          {Object.entries(tx.adds).map(
                                            ([playerId], index) => {
                                              const playerObj = Array.isArray(
                                                fetchedPlayers
                                              )
                                                ? fetchedPlayers.find(
                                                    (p) =>
                                                      p.playerId === playerId
                                                  )
                                                : null;

                                              return (
                                                <div key={playerId}>
                                                  <PlayerCard
                                                    player={
                                                      playerObj.playerData
                                                    }
                                                  />
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {tx.drops && (
                                      <div className="mb-2">
                                        <p className="text-sm font-semibold text-red-700 mb-1">
                                          Dropped:
                                        </p>
                                        <div className="space-y-1">
                                          {Object.entries(tx.drops).map(
                                            ([playerId]) => {
                                              const playerObj = Array.isArray(
                                                fetchedPlayers
                                              )
                                                ? fetchedPlayers.find(
                                                    (p) =>
                                                      p.playerId === playerId
                                                  )
                                                : null;

                                              return (
                                                <div key={playerId}>
                                                  <PlayerCard
                                                    player={
                                                      playerObj.playerData
                                                    }
                                                  />
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}

                                {tx.type === "trade" && (
                                  <>
                                    {tx.adds && (
                                      <div className="mb-2">
                                        <p className="text-sm font-semibold text-green-700 mb-1">
                                          Acquired:
                                        </p>
                                        <div className="space-y-1">
                                          {Object.entries(tx.adds)
                                            .filter(([playerId, rosterId]) => {
                                              const roster =
                                                tx.league_data?.roster_data?.[
                                                  rosterId - 1
                                                ];
                                              return (
                                                roster?.owner_id ===
                                                user?.sleeper_id
                                              );
                                            })
                                            .map(([playerId, rosterId]) => {
                                              const playerObj = Array.isArray(
                                                fetchedPlayers
                                              )
                                                ? fetchedPlayers.find(
                                                    (p) =>
                                                      p.playerId === playerId
                                                  )
                                                : null;

                                              return (
                                                <div key={playerId}>
                                                  <PlayerCard
                                                    player={
                                                      playerObj.playerData
                                                    }
                                                  />
                                                </div>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    )}

                                    {tx.drops && (
                                      <div className="mb-2">
                                        <p className="text-sm font-semibold text-red-700 mb-1">
                                          Traded Away:
                                        </p>
                                        <div className="space-y-1">
                                          {Object.entries(tx.drops)
                                            .filter(([playerId, rosterId]) => {
                                              const roster =
                                                tx.league_data?.roster_data?.[
                                                  rosterId - 1
                                                ];
                                              return (
                                                roster?.owner_id ===
                                                user.sleeper_id
                                              );
                                            })
                                            .map(([playerId, rosterId]) => {
                                              const playerObj = Array.isArray(
                                                fetchedPlayers
                                              )
                                                ? fetchedPlayers.find(
                                                    (p) =>
                                                      p.playerId === playerId
                                                  )
                                                : null;

                                              return (
                                                <div key={playerId}>
                                                  <PlayerCard
                                                    player={
                                                      playerObj.playerData
                                                    }
                                                  />
                                                </div>
                                              );
                                            })}
                                        </div>
                                      </div>
                                    )}

                                    <div className="mb-2">
                                      {tx.draft_picks.map((pick, index) => {
                                        const acquired =
                                          pick.owner_id === user.sleeper_id;
                                        const gaveUp =
                                          pick.previous_owner_id ===
                                          user.sleeper_id;

                                        if (acquired) {
                                          return (
                                            <p
                                              key={index}
                                              className="text-sm text-green-700"
                                            >
                                              <span className="font-semibold">
                                                Acquired
                                              </span>{" "}
                                              Pick: Round {pick.round},{" "}
                                              {pick.season}
                                            </p>
                                          );
                                        }
                                        if (gaveUp) {
                                          return (
                                            <p
                                              key={index}
                                              className="text-sm text-red-700"
                                            >
                                              <span className="font-semibold">
                                                Gave Up
                                              </span>{" "}
                                              Pick: Round {pick.round},{" "}
                                              {pick.season}
                                            </p>
                                          );
                                        }
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {!isLoadingTransactions &&
                        !isLoadingLeagues &&
                        user.sleeper_username &&
                        transactions.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                              <svg
                                className="w-8 h-8 text-blue-600"
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
                            <p className="text-lg font-semibold text-gray-900 mb-3">
                              No recent transactions
                            </p>
                            <p className="text-sm text-gray-600">
                              Transaction history will appear here
                            </p>
                          </div>
                        )}
                    </>
                  )}

                  {!user.sleeper_username && (
                    <div className="text-gray-600 py-12 bg-white rounded-lg border border-gray-200">
                      Link your Sleeper account to view recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <div className="flex justify-center">
              <Logout />
            </div>
          </div>
        )}

        {!user && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Please Log In</h2>
            <Login />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
