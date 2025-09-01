"use client";

import { ChevronDown } from "lucide-react";
import PlayerCard from "../components/PlayerCard";
import Roster from "../components/Roster";

export default function Rosters({ userRoster, starters }) {
  return (
    <div className="flex justify-center">
      <Roster roster={userRoster} starters={starters} />
    </div>
  );
}
