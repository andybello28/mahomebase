"use client";

import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoginPage from "../../components/LoginPage";

import { useLeagues, useUser } from "../../context/Context.jsx";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

import { addLeague, fetchAllLeagues, deleteLeague } from "../../utils/leagues";

export default function Leagues() {
  const { user, isLoadingUser } = useUser();
  const { allLeagues, setAllLeagues, isLoadingLeagues } = useLeagues();
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [inputLeague, setInputLeague] = useState("");
  const [showLeagueForm, setShowLeagueForm] = useState(false);

  const router = useRouter();

  const handleSelectLeague = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}`);
  };

  const handleSelectTrade = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}/trades`);
  };

  const handleSelectStartSit = (leagueId) => {
    router.push(`/profile/leagues/${leagueId}/start-sit`);
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
      {user && !isLoadingUser && (
        <div className="flex-grow flex flex-col p-6 space-y-6">
          <div className="flex flex-row gap-2">
            <img
              src="/assets/sleeper.png"
              alt="Sleeper logo"
              className="w-6 h-6 object-contain"
            />
            {user?.sleeper_username && (
              <h2 className="text-xl font-bold text-gray-900">
                {user.sleeper_username}
              </h2>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Search leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <div className="flex items-center">
              {showLeagueForm && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputLeague}
                    onChange={(e) => setInputLeague(e.target.value)}
                    placeholder="Enter league ID"
                    className="px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <button
                    type="submit"
                    onClick={onSubmit}
                    className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 border border-gray-300"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowLeagueForm((prev) => !prev)}
                    className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 border border-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
              {!showLeagueForm && (
                <button
                  onClick={() => setShowLeagueForm((prev) => !prev)}
                  className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-700 transition-colors duration-200 font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 border border-gray-300"
                >
                  Add League
                </button>
              )}
            </div>
          </div>
          {isLoadingLeagues && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-red-600 border-t-transparent"></div>
              <span className="ml-3 text-sm text-gray-600 font-medium">
                Loading leagues...
              </span>
            </div>
          )}
          {selectedLeagues.length === 0 && !isLoadingLeagues && (
            <div className="flex flex-col w-full items-center justify-center py-12 px-6">
              <h3 className="text-2xl font-bold text-red-500 mb-3">
                No Leagues Found
              </h3>
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {!isLoadingLeagues &&
              selectedLeagues?.map((league, index) => (
                <div
                  key={league.league_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col">
                      <div className="text-lg font-semibold text-gray-900">
                        {league.name || `League ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 font-medium">
                        {league.rosters || 0} teams
                        <span className="ml-2 text-gray-500">
                          | {league.season}
                        </span>
                        <span className="ml-2 text-gray-500">| Sleeper</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleDeleteLeague(league.league_id);
                      }}
                      className="self-start text-red-500 hover:scale-110 transition-transform duration-200"
                    >
                      <IoMdRemoveCircleOutline className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={() => handleSelectLeague(league.league_id)}
                      className="w-full px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    >
                      League
                    </button>

                    <button
                      onClick={() => handleSelectTrade(league.league_id)}
                      className="w-full px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-7000 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    >
                      Trade Advice
                    </button>

                    <button
                      onClick={() => handleSelectStartSit(league.league_id)}
                      className="w-full px-4 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
                    >
                      Start-Sit
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!user && isLoadingUser}

      {!user && !isLoadingUser && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
          <LoginPage />
        </div>
      )}

      {!isLoadingUser && <Footer />}
    </div>
  );
}
