"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { fetchCurrentUser } from "../utils/auth";
import { fetchAllLeagues, updateLeagues, getLeague } from "../utils/leagues";
import { getRound } from "../utils/round";
import { fetchTransactions } from "../utils/transactions";
import { fetchTrendingPlayers, getPlayer } from "../utils/players";
import { getSleeperUsername } from "../utils/sleeperUsername";

const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [sleeperId, setSleeperId] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const currentUser = await fetchCurrentUser();

      setUser((prev) => {
        if (prev?.sleeper_id) return prev;
        return currentUser;
      });

      if (currentUser?.sleeper_username) {
        setSleeperUsername(currentUser.sleeper_username);
      }
      if (currentUser?.sleeper_id) {
        setSleeperId(currentUser.sleeper_id);
      }
    };
    getUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        sleeperUsername,
        setSleeperUsername,
        sleeperId,
        setSleeperId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}

const LeaguesContext = createContext();
export function LeaguesProvider({ children }) {
  const { user } = useUser();
  const [allLeagues, setAllLeagues] = useState([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        if (!user) return;
        setIsLoadingLeagues(true);
        await updateLeagues();
        const googleId = user?.google_id;
        const response = await fetchAllLeagues(googleId);
        if (response?.leagues) {
          setAllLeagues(response.leagues);
        } else {
          setAllLeagues([]);
        }
      } catch (error) {
        console.error("Error fetching leagues: ", error);
        setAllLeagues([]);
      } finally {
        setIsLoadingLeagues(false);
      }
    };
    fetchLeagues();
  }, [user]);
  return (
    <LeaguesContext.Provider
      value={{
        allLeagues,
        setAllLeagues,
        isLoadingLeagues,
        setIsLoadingLeagues,
      }}
    >
      {children}
    </LeaguesContext.Provider>
  );
}
export function useLeagues() {
  return useContext(LeaguesContext);
}

const SeasonContext = createContext();
export function SeasonProvider({ children }) {
  const [season, setSeason] = useState("2025");
  const [week, setWeek] = useState(1);
  useEffect(() => {
    const fetchRound = async () => {
      const roundData = await getRound();
      setSeason(roundData.season);
      setWeek(roundData.week);
    };
    fetchRound();
  }, []);
  return (
    <SeasonContext.Provider value={{ season, setSeason, week, setWeek }}>
      {children}
    </SeasonContext.Provider>
  );
}
export function useSeason() {
  return useContext(SeasonContext);
}

const TransactionsContext = createContext();
export function TransactionsProvider({ children }) {
  const { user } = useUser();
  const { allLeagues } = useLeagues();
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  useEffect(() => {
    const handleFetchTransactions = async () => {
      if (!user?.google_id || allLeagues.length === 0) return;

      setIsLoadingTransactions(true);
      try {
        console.log("Transactions context");
        const transactions = await fetchTransactions(user.google_id);
        setTransactions(transactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    handleFetchTransactions();
  }, [user?.google_id, allLeagues]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        setTransactions,
        isLoadingTransactions,
        setIsLoadingTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
export function useTransactions() {
  return useContext(TransactionsContext);
}

const TrendingPlayersContext = createContext();
export function TrendingProvider({ children }) {
  const [trendingPlayers, setTrendingPlayers] = useState([]);
  const [isLoadingTrendingPlayers, setIsLoadingTrendingPlayers] =
    useState(false);
  useEffect(() => {
    const handleFetchTrendingPlayers = async () => {
      try {
        setIsLoadingTrendingPlayers(true);
        const players = await fetchTrendingPlayers();
        setTrendingPlayers(players);
        return players;
      } catch (error) {
        console.error("Error fetching trending players: ", error);
      } finally {
        setIsLoadingTrendingPlayers(false);
      }
    };
    handleFetchTrendingPlayers();
  }, []);
  return (
    <TrendingPlayersContext.Provider
      value={{
        trendingPlayers,
        setTrendingPlayers,
        isLoadingTrendingPlayers,
        setIsLoadingTrendingPlayers,
      }}
    >
      {children}
    </TrendingPlayersContext.Provider>
  );
}
export function useTrendingPlayers() {
  return useContext(TrendingPlayersContext);
}

// Because this requires a prop, you must individually wrap it and pass leagueid as a prop if you want rosters.
// You must wrap it individually, like how it was done in [leagueid] page
const LeagueContext = createContext();
export function LeagueProvider({ children, leagueid }) {
  const { user } = useUser();
  const [league, setLeague] = useState(null);
  const [leagueRosters, setLeagueRosters] = useState(null);

  useEffect(() => {
    const fetchLeague = async () => {
      const res = await getLeague(user?.google_id, leagueid);
      setLeague(res.league);
    };
    if (user && leagueid) fetchLeague();
  }, [user, leagueid]);

  useEffect(() => {
    const fetchRosterPlayers = async () => {
      if (!league?.roster_data) return;
      const enrichedRosters = await Promise.all(
        league.roster_data.map(async (roster) => {
          let username = "Unknown";
          if (roster.owner_id) {
            try {
              const fetchedUsername = await getSleeperUsername(roster.owner_id);
              username = fetchedUsername || "Unknown";
            } catch {
              username = "Unknown";
            }
          }

          if (!roster.players || roster.players.length === 0) {
            return {
              ...roster,
              players: [],
              starters: [],
              username,
            };
          }

          const playersWithData = await Promise.all(
            roster.players.map(async (playerId) => {
              try {
                const player = await getPlayer(playerId);
                return { id: playerId, data: player };
              } catch (err) {
                console.error(`Failed to fetch player ${playerId}`, err);
                return { id: playerId, player: null };
              }
            })
          );

          const startersWithData = await Promise.all(
            roster.starters.map(async (playerId) => {
              try {
                const player = await getPlayer(playerId);
                return { id: playerId, data: player };
              } catch (err) {
                console.error(`Failed to fetch player ${playerId}`, err);
                return { id: playerId, player: null };
              }
            })
          );

          return {
            ...roster,
            starters: startersWithData,
            players: playersWithData,
            username,
          };
        })
      );

      setLeagueRosters(enrichedRosters);
    };

    fetchRosterPlayers();
  }, [league]);

  return (
    <LeagueContext.Provider value={{ league, leagueRosters, setLeagueRosters }}>
      {children}
    </LeagueContext.Provider>
  );
}
export function useLeague() {
  return useContext(LeagueContext);
}

export function Providers({ children }) {
  return (
    <UserProvider>
      <LeaguesProvider>
        <SeasonProvider>
          <TransactionsProvider>
            <TrendingProvider>{children}</TrendingProvider>
          </TransactionsProvider>
        </SeasonProvider>
      </LeaguesProvider>
    </UserProvider>
  );
}

export {};
