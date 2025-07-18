"use client";

import { useParams } from "next/navigation";
import { LeagueProvider } from "../../../context/Context";
import LeaguePage from "./LeaguePage";

export default function LeaguePageWrapper() {
  const { leagueid } = useParams();

  return (
    <LeagueProvider leagueid={leagueid}>
      <LeaguePage />
    </LeagueProvider>
  );
}
