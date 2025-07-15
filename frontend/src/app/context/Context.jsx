"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sleeperUsername, setSleeperUsername] = useState("");
  return (
    <UserContext.Provider
      value={{ user, setUser, sleeperUsername, setSleeperUsername }}
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
  const [leagues, setLeagues] = useState([]);
  return (
    <LeaguesContext.Provider value={{ leagues, setLeagues }}>
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
  const [transactions, setTransactions] = useState([]);
  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
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
  return (
    <TrendingPlayersContext.Provider
      value={{ trendingPlayers, setTrendingPlayers }}
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
