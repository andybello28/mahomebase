"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/auth";

import Footer from "../components/Footer";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";

export default function Users() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      console.log(currentUser);
      setIsLoading(false);
    };
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[100vh]">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-start">
        {user && (
          <>
            <span>Welcome, {user.name}</span>
            <span>
              Winning leagues with Mahomebase since{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
            <Logout />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
