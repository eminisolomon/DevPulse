# DevPulse - Developer Performance Dashboard

**Goal:** Build a cross-platform (Android-first) client for WakaTime/Wakapi that feels like a premium SaaS product.
**Vibe:** GitHub Mobile + Strava for Code.

## 🚀 Phase 1: The "Essentials" (MVP) [COMPLETED]

### Authentication & Setup

- [x] Multi-Instance Auth (WakaTime/Wakapi toggle)
- [x] Secure API Key storage using `expo-secure-store`
- [x] Handle "401 Unauthorized" gracefully
- [x] Handle "404 Not Found" gracefully

### Data Layer & State

- [x] Set up TanStack Query with caching
- [x] Create Utility Layer for data transformation

### Core Dashboard ("Pulse")

- [x] Donut Chart: Languages breakdown
- [x] Bar Chart: Daily Activity (Victory Native XL)
- [x] Human-readable time formatting

## 🌟 Phase 2: Enhanced Features [COMPLETED]

### Navigation & Deep Dives

- [x] Interactive Time-Travel (Activity Chart integration)
- [x] Dedicated Project Detail Page
- [x] Projects List with Sparklines
- [x] Goals Feature with visual progress

### Performance

- [x] Optimized data fetching with custom hooks

## 💎 Phase 3: Premium UI & UX [COMPLETED]

### Android Integration

- [x] Material-inspired Theming & Dark Mode
- [x] Adaptive layouts

### Enhanced UX

- [x] Interactive tooltips on charts
- [x] Punch Card activity insights
- [x] Logout Confirmation Bottom Sheet

---

## 🏗 Post-MVP / Future Roadmap

### Features

- [ ] **Write Access for Goals**: Create/Edit goals in-app.
- [ ] **Advanced Filtering**: Filter leaderboards by language/project.
- [ ] **Session Details**: Start/End times for individual coding blocks.
- [ ] **Push Notifications**: Goal reminders & rank changes.

### Technical

- [ ] **Native Widgets**: Android home screen widgets for daily progress.
- [ ] **Offline Mode**: Local caching of latest stats for offline viewing.
- [ ] **Performance Audit**: Fine-tune Reanimated and Skia performance.
