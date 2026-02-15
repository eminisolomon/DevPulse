# DevPulse - Developer Performance Dashboard

**Goal:** Build a cross-platform (Android-first) client for WakaTime/Wakapi that feels like a premium SaaS product.
**Vibe:** GitHub Mobile + Strava for Code.

## 🚀 Phase 1: The "Essentials" (MVP)

### Authentication & Setup

- [ ] **Multi-Instance Auth**
  - [ ] Implement toggle/dropdown for WakaTime vs. Custom Wakapi URL
  - [ ] Secure API Key storage using `expo-secure-store`
  - [ ] Handle "401 Unauthorized" (expired keys) gracefully
  - [ ] Handle "404 Not Found" (missing Wakapi instances) gracefully

### Date Layer & State

- [ ] **Data Management**
  - [ ] Set up TanStack Query with caching (`staleTime: 5 mins`)
  - [ ] Create Utility Layer to flatten nested WakaTime JSON data

### Core Dashboard ("Pulse")

- [ ] **Data Visualization**
  - [ ] Donut Chart: Languages breakdown (using Victory Native XL / Skia)
  - [ ] Bar Chart: Daily Activity (using Victory Native XL / Skia)
- [ ] **UI Polish**
  - [ ] Human-readable time formatting (e.g., "3h 42m")

## 🌟 Phase 2: The "LiniTime Killer" Features

### Navigation & Deep Dives

- [ ] **Interactive Time-Travel**
  - [ ] Horizontal calendar strip (last 30 days)
  - [ ] Quick jump to specific dates
- [ ] **Project Analytics**
  - [ ] Dedicated Project Detail Page
  - [ ] Top Files list (time consumption)
  - [ ] Operating System breakdown

### Performance

- [ ] **Background Sync**
  - [ ] Implement `expo-task-manager` for periodic data fetching

## 💎 Phase 3: The "2026 Modern" Touch

### Android Integration

- [ ] **Native Features**
  - [ ] Native Android Widgets (Daily Goal Progress) via Expo Config Plugins
  - [ ] Material You (Android 12+) UI color adaptation

### Enhanced UX

- [ ] **Interactivity**
  - [ ] Detailed tooltips on charts (Long-press interaction)

## 🏗 Technical Architecture

- **Routing:** Stack (Settings/Add Instance) + Tabs (Stats/Projects/Goals)
- **Styling:** NativeWind (Tailwind CSS)
- **Charts:** Victory Native XL (Skia based)
- **State Management:** TanStack Query
