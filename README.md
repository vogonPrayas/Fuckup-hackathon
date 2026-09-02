# Wildline

Wildline is a wild-camping itinerary planner. A user drops a coarse start/end
on a map, sets a trip length and daily walking capacity, and gets a decent
route with camp spots and lookout points in seconds — the "blissful" path.
On top of that plan, a **risk simulation layer** can be switched on: it runs
weather, terrain, fatigue and gear-failure probabilities against the same
itinerary and surfaces what could actually go wrong, day by day, with
suggested mitigations.

Two moods, one itinerary: confident and inviting by default, honest about
risk when the user asks for it.

Frontend is Next.js. This document breaks the whole system into components
that can be built and owned independently, so the team can split up work
without stepping on each other.

---

## Product flow

1. **Setup** — coarse location, start/end pins, trip duration (days), daily
   walking capacity → "Plan my route"
2. **Itinerary** — generated route with day-by-day camp spots and lookout
   points, shown as a calm, finished plan
3. **Risk overlay** — the same itinerary, now annotated with a per-day risk
   score and flagged risk factors (weather / terrain / fatigue / gear)
4. **Risk detail** — deep dive on one day's simulated risks, with
   probabilities, a plain-language narrative, and a mitigation suggestion
   (e.g. shorten the day, camp lower)

See `design/` for mockups of all four screens (published as a design canvas —
link shared separately).

---

## Frontend components (Next.js)

| Component | Description | Depends on |
|---|---|---|
| **Trip setup wizard** | Map input screen: location search, start/end pin placement, duration stepper, walking-capacity selector | Map component, Geocoding API |
| **Map / route renderer** | Wraps a map library (MapLibre GL recommended — no vendor lock-in) to draw the base map, route line, camp/lookout markers, and risk-colored route segments | Map tiles provider, Itinerary API |
| **Itinerary view** | Day-by-day cards: distance, elevation gain, terrain notes, camp spot details, lookout callouts; day selector/chips | Itinerary API |
| **Risk overlay UI** | Risk score badges on day chips, risk banner, risk factor chips (icon + label + probability) layered onto the itinerary view | Risk Simulation API |
| **Risk detail screen** | Per-day risk breakdown: weather/terrain/fatigue/gear sections, probability meters, narrative text, mitigation suggestion card | Risk Simulation API |
| **Design system** | Shared tokens (color, type, spacing), buttons, cards, sliders, badges, icons — used by every screen above | — |
| **App state / wizard flow** | Client-side state machine for the setup → itinerary → risk flow; persists trip params across screens | — |
| **Trip persistence (optional)** | Save/reload/share a planned trip via a shareable link | Trip Storage API |

## Backend / services

| Service | Description | Notes |
|---|---|---|
| **Geocoding service** | Resolves a coarse place name / map click to a bounding region | Can start as a thin wrapper over an existing geocoder (Nominatim, Mapbox Geocoding) |
| **Trail & terrain data service** | Ingests trail network (OpenStreetMap) and elevation data (SRTM/DEM) for the region | Heaviest data-engineering piece; can be pre-baked per demo region for a hackathon |
| **Route generation engine** | Given start/end/duration/daily-capacity, produces a multi-day route split into daily segments that respect walking capacity and elevation | Core planning algorithm; can start as a greedy/heuristic splitter, evolve to real optimization |
| **Camp spot & lookout POI service** | Database of candidate wild-camping spots and viewpoints along a region, with legality/amenity metadata (water source, shelter, exposure) | Can be seeded manually for demo regions |
| **Weather forecast service** | Pulls forecast (or historical-probability) data per day/segment of the route | Open-Meteo or similar for a hackathon; feeds the risk engine |
| **Fatigue model** | Estimates cumulative physical load per day from distance + elevation gain vs. the user's stated capacity | Pure function service — no external data needed, good first task |
| **Gear/equipment risk model** | Probabilistic model of gear-related failure modes (e.g. stakes in soft/rocky ground, water resupply gaps) based on terrain + trip length | Rule-based table is enough for v1 |
| **Risk simulation engine** | Combines weather + terrain + fatigue + gear signals into a per-day risk score and a ranked list of risk factors, run as a Monte-Carlo-style simulation over the itinerary | Orchestrates the four models above; owns the "what could go wrong" narrative generation |
| **Itinerary API** | Public API the frontend calls: `POST /itinerary` (setup params → itinerary), `GET /itinerary/:id/risk` (itinerary → risk breakdown) | Thin orchestration layer over the services above |
| **Trip storage API (optional)** | Persists a generated itinerary for sharing/reload | Can be a simple key-value store for a hackathon |

## Suggested stack

- **Frontend**: Next.js (App Router), MapLibre GL JS, Tailwind or CSS
  modules matching the design tokens in `design/`
- **Backend**: whatever the team already knows — the services above are
  cleanly separable regardless of language; a hackathon can fake most of
  them with static JSON per demo region and still demo the full flow
- **Data**: OpenStreetMap trail extracts + SRTM elevation tiles for one or
  two demo regions; Open-Meteo (or similar free API) for weather

## Suggested delegation for a small team

- **Person A** — Trip setup wizard + Map/route renderer (frontend)
- **Person B** — Itinerary view + Risk overlay UI + Risk detail screen (frontend)
- **Person C** — Route generation engine + Camp/lookout POI data (backend)
- **Person D** — Risk simulation engine (weather + terrain + fatigue + gear
  models) (backend)

Each pair (A+C, B+D) can develop against a mocked API contract
(`/itinerary`, `/itinerary/:id/risk`) before the real services are wired up.
