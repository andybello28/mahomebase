"use client";

import { ChevronDown } from "lucide-react";
import PlayerCard from "../components/PlayerCard";
import Roster from "../components/Roster";

export default function Rosters({ userRoster, starters }) {
  return (
    <>
      <div className="flex flex-grow">
        <Roster roster={userRoster} starters={starters} />
        <button>Generate Advice</button>
      </div>
    </>
  );
}
