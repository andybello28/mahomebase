"use client";

import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useLeagues, useUser } from "../../context/Context.jsx";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

import { addLeague, fetchAllLeagues, deleteLeague } from "../../utils/leagues";

export default function Leagues() {
  const { user, setUser } = useUser();
  const { allLeagues, setAllLeagues } = useLeagues();
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [inputLeague, setInputLeague] = useState("");
  const [showLeagueForm, setShowLeagueForm] = useState(false);

  const router = useRouter();

  const handleSelectLeague = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}`);
  };

  useEffect(() => {
    if (!user?.google_id) return;

    const loadLeagues = async () => {
      const leagues = await fetchAllLeagues(user.google_id);
      setAllLeagues(leagues.leagues);
    };

    loadLeagues();
  }, [user]);

  const handleDeleteLeague = async (leagueId) => {
    try {
      // Delete league in backend
      await deleteLeague(user.google_id, leagueId);

      // Re-fetch updated league list
      const updatedLeagues = await fetchAllLeagues(user.google_id);
      setAllLeagues(updatedLeagues.leagues);
    } catch (error) {
      toast.error("Failed to delete league. Please try again.");
      console.error("Delete league error:", error);
    }
  };

  useEffect(() => {
    setSelectedLeagues(allLeagues.leagues);
  }, [allLeagues]);

  useEffect(() => {
    if (!Array.isArray(allLeagues)) {
      setSelectedLeagues([]);
      return;
    }

    const filtered = allLeagues.filter((league) =>
      league.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedLeagues(filtered);
  }, [searchTerm, allLeagues]);

  const handleAddLeague = async (googleId, leagueId) => {
    try {
      const response = await addLeague(googleId, leagueId);

      if (response.error) {
        toast.error(response.error);
      } else if (response.message) {
        toast.success(response.message);
        const updatedLeagues = await fetchAllLeagues(user.google_id);
        setAllLeagues(updatedLeagues.leagues);
      } else {
        toast.info("Unexpected response");
      }
    } catch (error) {
      toast.error("Failed to add league. Please try again.");
    }
    setInputLeague("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!inputLeague.trim()) {
      toast.warn("Please enter a league ID");
      return;
    }
    if (!user?.google_id) {
      toast.error("User not logged in");
      return;
    }
    await handleAddLeague(user.google_id, inputLeague.trim());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col p-4 space-y-4">
        <div className="flex flex-row gap-2">
          <img
            src="/assets/sleeper.png"
            alt="Sleeper logo"
            className="w-6 h-6 object-contain"
          />
          {user?.sleeper_username && (
            <h2 className="text-xl font-bold text-slate-400">
              {user.sleeper_username}
            </h2>
          )}
        </div>
        <div className="flex flex-row gap-20">
          {" "}
          <input
            type="text"
            placeholder="Search leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center">
            {showLeagueForm && (
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputLeague}
                  onChange={(e) => setInputLeague(e.target.value)}
                  placeholder="Enter league ID"
                  className="px-3 py-1 border border-slate-300 rounded"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </form>
            )}
            <button onClick={() => setShowLeagueForm((prev) => !prev)}>
              <IoMdAddCircleOutline />
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selectedLeagues?.map((league, index) => (
            <div
              key={league.league_id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-lg font-semibold text-slate-800">
                {league.name || `League ${index + 1}`}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {league.rosters || 0} teams
                <span className="ml-2 text-slate-500">| {league.season}</span>
              </div>
              <div className="flex flex-row items-center justify-start gap-40 relative z-10 mt-6 text-right">
                <button
                  onClick={() => {
                    handleDeleteLeague(league.league_id);
                  }}
                  className="text-red-500 hover:scale-110"
                >
                  <IoMdRemoveCircleOutline />
                </button>
                <button
                  onClick={() => handleSelectLeague(league.league_id)}
                  className="self-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:brightness-110 transition"
                >
                  More...
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
