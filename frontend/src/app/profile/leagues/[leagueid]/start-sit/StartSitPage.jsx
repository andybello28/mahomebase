"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../../../components/Footer";
import Navbar from "../../../../components/Navbar";
import { useRouter } from "next/navigation";
import { useLeague, useUser } from "../../../../context/Context.jsx";

export default function Trades() {
  return (
    <>
      <Navbar />
      <span>Start-sit</span>
      <Footer />
    </>
  );
}
