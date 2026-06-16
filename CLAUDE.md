# Mahomebase — Claude Context

## Project Purpose
AI-powered fantasy football assistant. Users connect Sleeper fantasy leagues and receive AI-driven start/sit advice and trade proposals, powered by OpenAI's `o4-mini` model with player data sourced from the Sleeper and ESPN APIs.

## Repository Layout
```
mahomebase/
├── backend/          Node.js / Express API (port 4000)
├── frontend/         Next.js 15 app (port 3000)
└── docker-compose.yml
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 4, JavaScript/JSX |
| Backend | Node.js, Express.js 5, JavaScript (CommonJS) |
| Database | PostgreSQL 16 via Prisma ORM |
| Cache | Redis 7 (5–8 min TTL, randomized to avoid stampedes) |
| Auth | Passport.js + Google OAuth 2.0 + express-session stored in PostgreSQL |
| AI | OpenAI API — model `o4-mini`, `reasoning.effort: "medium"`, JSON output mode |
| External APIs | Sleeper API (fantasy data), ESPN partners/site APIs (player stats/projections) |
| Scheduling | node-cron (daily player syncs) |
| Prod hosting | Railway (backend), Vercel (frontend) |

## Dev Commands

```bash
# Backend
cd backend && npm run dev       # nodemon, port 4000

# Frontend
cd frontend && npm run dev      # Next.js + Turbopack, port 3000

# Full stack
docker-compose up               # PostgreSQL + Redis + backend + frontend
```

## Environment Variables

**Backend `.env`**: `DB_URL`, `REDIS_URL`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, `FRONTEND_URL`, `BACKEND_URL`, `NODE_ENV`, `PORT`

**Frontend `.env`**: `NEXT_PUBLIC_API_URL` (points to backend, e.g. `http://localhost:4000`)

## Database Schema (Prisma)

**`User`** — `google_id` (PK), `email`, `name`, `sleeper_username`, `sleeper_id`, `league_ids String[]`, `excluded_league_ids String[]`

**`League`** — `league_id` (PK), `name`, `season`, `rosters`, `roster_positions Json`, `scoring_settings Json`, `roster_data Json`, `transactions Json`, `total_linked Int`
- `total_linked` is a reference counter. If > 1 when a user deletes a league, the row stays and decrements; only deleted when it reaches 1.

**`Player`** — `id` (Sleeper player_id), `first_name`, `last_name`, `search_full_name`, `team`, `position`, `fantasy_positions`, `stats Json`, `projection String`, `headshot String`

**`Session`** — managed by `@quixo3/prisma-session-store` for Passport sessions.

## Backend Entry Point: `backend/index.js`
Middleware order matters:
1. `express.json()` + `urlencoded()`
2. `cors()` — restricted to `FRONTEND_URL`, credentials allowed
3. `express-session` — cookie scoped to `.mahomebasefantasy.com` in prod, `lax` in dev
4. `passport.initialize()` + `passport.session()`
5. Routes mounted: `/auth`, `/users`, `/nfl`, `/recommendations`
6. `startPlayerScheduler()` + `startWeeklyPlayerUpdate()` — cron jobs registered immediately

## Backend Routes

### `/auth` — `authRouter.js`
- `GET /auth/google` — initiates Google OAuth
- `GET /auth/google/callback` — OAuth callback; success → `/profile`, fail → `/?login=fail`
- `GET /auth/user` — returns `req.user` if authenticated (used by frontend on load)
- `GET /auth/logout` — destroys session, clears cookie, redirects to frontend

### `/users` — `usersRouter.js`
All routes read `req.user` populated by Passport `deserializeUser`.
- `PUT /:googleid/sleeper` — links Sleeper username; validates against Sleeper API, writes `sleeper_id` to DB, busts `user:*` Redis cache
- `DELETE /:googleid/sleeper` — unlinks Sleeper account and deletes all associated leagues
- `GET /:googleid/leagues` — returns all leagues for user from DB (Redis-cached)
- `PUT /:googleid/leagues` — syncs leagues from Sleeper API (upserts new ones, updates existing)
- `PUT /:googleid/leagues/:leagueid` — manually add a specific league by ID; validates user is in it via Sleeper API
- `DELETE /:googleid/leagues/:leagueid` — removes league; respects `total_linked` ref counter
- `GET /:googleid/leagues/transactions` — all recent transactions across all leagues
- `GET /:googleid/leagues/:leagueid/transactions` — transactions for one league
- `GET /:googleid/leagues/:leagueid` — single league data

### `/nfl` — `nflRouter.js`
- `GET /nfl/season` — current week/season/seasonType from Sleeper state API
- `GET /nfl/players/trending` — top 50 trending adds (last 24h) from Sleeper, resolved to Player records
- `GET /nfl/players/:playerid` — single player from PostgreSQL

### `/recommendations` — `recommendationsRouter.js`
The AI core. No middleware guards (relies on `req.user` being set by Passport).
- `GET /recommendations/lineup/:leagueid` — start/sit advice
  - Fetches league from DB, finds user's roster, enriches each player via `getPlayer()`
  - Sends roster + positions + PPR to `o4-mini`
  - Returns `{ swaps: [[start_id, bench_id], ...], explanation }`
- `GET /recommendations/trade/:leagueid/:owner_id` — trade proposal
  - Builds both rosters (user + opponent), enriches all players
  - Sends to `o4-mini`
  - Returns `{ players_received, players_traded, explanation }`

**Important:** AI quality depends entirely on the nightly ESPN sync. Player `stats` and `projection` come from PostgreSQL, not live data.

## Data Layer: `db/queries.js`

All DB access goes through this file. Redis sits in front of PostgreSQL for users and leagues.

| Function | Cache behavior |
|---|---|
| `getUserByGoogleId` | Read Redis first; write on miss; invalidated by link/unlink |
| `getLeague` | Read Redis first; write on miss; invalidated/updated on delete/upsert |
| `getPlayer` | No cache — direct PostgreSQL |
| `getLeagueTransactions` | No cache — reads from `league.transactions` JSON column |
| `upsertLeague` | Fetches rosters + transactions from Sleeper, writes DB + Redis |
| `updateLeague` | Same as upsert but no `league_ids` push on user |
| `createPlayers` | Bulk upsert from Sleeper `/players/nfl` endpoint |
| `updatePlayersESPN` | Enriches Player rows with `headshot`, `projection`, `stats` from ESPN |

**Offseason handling:** `upsertLeague` and `updateLeague` both check `seasonType`. If `"post"` or `"off"` and new roster data from Sleeper is empty, the existing roster data is preserved to avoid wiping real rosters.

## Scheduled Jobs: `schedulers/playerScheduler.js`
- **3:00 AM daily** — `createPlayers()`: full Sleeper player list upserted to PostgreSQL
- **4:00 AM daily** — `updatePlayersESPN()`: ESPN API enriches each player with `headshot`, `projection`, `stats` in chunks of 25

## Auth Flow
```
Browser → GET /auth/google
       → Google OAuth consent
       → GET /auth/google/callback
       → passport.js GoogleStrategy → findOrCreate() → session serialized (user.id)
       → redirect /profile
Every subsequent request: session cookie → deserializeUser → prisma.user.findUnique → req.user
```

## Frontend Architecture

### Entry Points
- `frontend/src/app/page.jsx` — landing page
- `frontend/src/app/layout.jsx` — wraps entire app in `<Providers>`

### Global Context: `context/Context.jsx`
Five nested providers, each with a dependency chain:
```
<UserProvider>              ← fetches /auth/user on mount
  <LeaguesProvider>         ← fetches leagues when user is set
    <SeasonProvider>        ← fetches /nfl/season on mount (independent)
      <TransactionsProvider>← fetches when user + leagues are both set
        <TrendingProvider>  ← fetches /nfl/players/trending on mount (independent)
```

`<LeagueProvider>` is page-scoped (not global) — wraps `[leagueid]` pages individually and accepts `leagueid` as a prop. It fetches roster data and enriches each player by calling `/nfl/players/:id` for every player on every roster.

### Page Routes
```
/                             → page.jsx (landing)
/profile                      → profile/page.jsx
/profile/leagues              → profile/leagues/page.jsx
/profile/leagues/[leagueid]   → wrapped in <LeagueProvider>
/profile/leagues/[leagueid]/start-sit
/profile/leagues/[leagueid]/trades
```

### Frontend Utils (`src/app/utils/`)
Thin fetch wrappers — each file maps to a domain:
- `auth.js` — `fetchCurrentUser()` → `GET /auth/user`
- `leagues.js` — `fetchAllLeagues`, `updateLeagues`, `getLeague`
- `players.js` — `fetchTrendingPlayers`, `getPlayer`
- `transactions.js` — `fetchTransactions`
- `round.js` — `getRound()` → `GET /nfl/season`
- `sleeperUsername.js` — fetches Sleeper API **directly from the browser** (only place frontend bypasses the backend)
- `start.js` — calls `/recommendations/lineup/:leagueid`
- `trade.js` — calls `/recommendations/trade/:leagueid/:owner_id`

## Key Architectural Notes

1. **Session auth is implicit** — `passport.deserializeUser` runs `prisma.user.findUnique` on every authenticated request (no Redis). All route handlers access `req.user.sleeper_id`, `req.user.league_ids`, etc. directly.

2. **`total_linked` ref counter** — leagues are shared across users. Never hard-delete a league without checking this counter; `db/queries.deleteLeague` handles it correctly.

3. **AI is bounded by ESPN sync freshness** — `o4-mini` only sees data from the last nightly 4 AM run. If players have missing `stats`/`projection`, the recommendations will be incomplete.

4. **`excluded_league_ids`** — when a user manually deletes a league, its ID is added to this array so the auto-sync (`PUT /users/:googleid/leagues`) won't re-add it on the next sync.

5. **Frontend hits Sleeper directly for team owner usernames** — `sleeperUsername.js` calls `api.sleeper.app` from the browser. All other external API calls are proxied through the backend.

6. **Cookie config differs by environment** — `domain` is `null` in dev, `.mahomebasefantasy.com` in prod; `secure` and `sameSite` also differ. The `trust proxy: 1` setting is required for Railway/Vercel to handle cookies correctly.
