"use client";

import { useParams } from "next/navigation";
import { LeagueProvider, useUser } from "../../../../context/Context";
import StartSitPage from "./StartSitPage";

export default function LeaguePageWrapper() {
  const { leagueid } = useParams();
  const { user, isLoadingUser } = useUser();
  if (!isLoadingUser && user?.league_ids.includes(leagueid)) {
    return (
      <LeagueProvider leagueid={leagueid}>
        <StartSitPage />
      </LeagueProvider>
    );
  } else if (!isLoadingUser) {
    return (
      <main className="grid h-full place-items-center bg-[rgb(255, 246, 255)] px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Red accent logo/icon area */}
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <p className="text-base font-semibold text-red-500">404</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg text-pretty text-gray-600 sm:text-xl">
            Looks like this play didn't work out. Let's get you back to your
            championship strategy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/profile/leagues"
              className="rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors"
            >
              Back to leagues
            </a>
          </div>
        </div>
      </main>
    );
  }
}
