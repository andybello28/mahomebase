"use client";

import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/auth";

import Footer from "../components/Footer";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Navbar from "../components/Navbar";

export default function Users() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[100vh]">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-start">
        {user && (
          <>
            <span>Welcome, {user.id}</span>
            <Logout />{" "}
          </>
        )}
        {!user && (
          <>
            <span>Please log in...</span>
            <Login />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
