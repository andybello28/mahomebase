"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { fetchCurrentUser } from "../utils/auth";
import { linkSleeper, unlinkSleeper } from "../utils/sleeperUsername";
import { fetchAllLeagues, updateLeagues } from "../utils/leagues";
import { getRound } from "../utils/round";
import { fetchTransactions } from "../utils/transactions";
import { fetchTrendingPlayers } from "../utils/players";

const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sleeperUsername, setSleeperUsername] = useState("");
  const [sleeperId, setSleeperId] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      if (currentUser?.sleeper_username) {
        setSleeperUsername(currentUser?.sleeper_username);
      }
      if (currentUser?.sleeper_id) {
        setSleeperId(currentUser?.sleeper_id);
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
  const [years, setYears] = useState([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        if (!user) return;
        setIsLoadingLeagues(true);
        const googleId = user?.google_id;
        await updateLeagues(googleId);
        const response = await fetchAllLeagues(googleId);
        if (response?.leagues) {
          setAllLeagues(response.leagues);
          const years = [];
          for (const league of response.leagues) {
            if (!years.includes(league.season)) {
              years.push(league.season);
            }
          }
          setYears(years);
        } else {
          setAllLeagues([]);
        }
      } catch (error) {
        console.error("Error fetching leagues: ", error);
        setAllLeagues([]);
        setYears([]);
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
        years,
        setYears,
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
      try {
        if (!user?.google_id || allLeagues.length === 0) return;
        setIsLoadingTransactions(true);
        const googleId = user?.google_id;
        const transactions = await fetchTransactions(googleId);
        setTransactions(transactions);
        return transactions;
      } catch (error) {
        console.error("Error fetching transactions: ", error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };
    handleFetchTransactions();
  }, [allLeagues]);
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
