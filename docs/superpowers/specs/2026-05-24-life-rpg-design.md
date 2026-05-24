# Life RPG — Design Spec
**Date:** 2026-05-24  
**Status:** Approved  
**Stack:** React + Vite · localStorage · No backend

---

## Overview

A personal gamification web app for recording daily achievements. Completing real-life tasks earns EXP, levels up a tabby cat avatar, and unlocks badges and virtual items. Single-user, runs entirely in the browser.

---

## Architecture

- **Framework:** React + Vite (JavaScript)
- **State:** React `useState` + `useEffect` persisted to `localStorage`
- **Routing:** Single page (no router needed — tabs handled in state)
- **Styling:** Plain CSS with CSS custom properties
- **Deployment:** GitHub Pages (static build, base: `/Life/`)

---

## Data Model (localStorage)

```json
{
  "profile": {
    "name": "string",
    "level": "number",
    "exp": "number",
    "streak": "number",
    "lastActiveDate": "YYYY-MM-DD"
  },
  "entries": [
    {
      "id": "uuid",
      "date": "YYYY-MM-DD",
      "category": "daily|health|learning|social|emotion",
      "title": "string",
      "points": "number",
      "createdAt": "ISO8601"
    }
  ],
  "badges": [{ "id": "string", "unlockedAt": "ISO8601 | null" }],
  "inventory": [{ "id": "string", "unlockedAt": "ISO8601 | null" }],
  "quests": {
    "daily": [{ "id": "string", "title": "string", "reward": "number", "completed": "boolean" }],
    "random": [{ "id": "string", "title": "string", "reward": "number", "completed": "boolean" }],
    "lastRefreshed": "YYYY-MM-DD"
  }
}
```

---

## EXP & Leveling

- Each logged entry grants EXP equal to manually entered points.
- Level thresholds: `expRequired(level) = Math.floor(100 * Math.pow(1.4, level - 1))`
- Lv.1→2: 100 EXP · Lv.5→6: ~538 · Lv.10→11: ~2892
- On level-up: display celebratory LevelUpToast, check item/badge unlocks.

---

## Categories

| ID | Label | Dot Color |
|----|-------|-----------|
| `daily` | 日常 | Amber `#fbbf24` |
| `health` | 健康 | Green `#34d399` |
| `learning` | 學習 | Blue `#60a5fa` |
| `social` | 社群 | Purple `#a78bfa` |
| `emotion` | 情感 | Pink `#f472b6` |

---

## Quest System

**Fixed daily quests** (reset at midnight):
1. 完成一件健康事項 → +30 EXP (auto-completes when health entry added)
2. 記錄任意 3 件事 → +20 EXP (auto-completes when 3rd entry of day added)
3. 今日登入 → +10 EXP (auto-completed on load)

**Random daily quests** (1–2 drawn from pool of 20 at midnight, seeded by date):

---

## Badges

| ID | Unlock Condition |
|----|-----------------|
| `health-hero` | 10 health entries total |
| `study-star` | 10 learning entries total |
| `streak-7` | 7-day streak |
| `champion` | Reach Level 20 |
| `lightning` | 5 entries in one day |
| `allstar` | All other badges unlocked |

---

## Virtual Items

| Item | Rarity | Unlock |
|------|--------|--------|
| 活力藥水 | Common | Lv.5 |
| 專注之盾 | Rare | Lv.10 |
| 時間寶石 | Epic | Lv.20 |

---

## Pixel Cat Avatar

- 14×20 pixel grid on `<canvas>` (CSS scaled to 112×160px)
- Default: orange tabby sitting pose, tail wrapped
- `image-rendering: pixelated`

---

## UI Layout (3-column)

```
┌──────────────┬───────────────────────┬──────────────┐
│  Left 240px  │    Center (flex 1)    │  Right 230px │
│              │                       │              │
│ Pixel Cat    │  Feed Header          │ Daily Quests │
│ Level / XP   │  Category Chips       │ Random Quest │
│ Category bars│  Entry list           │ ──────────── │
│ ──────────── │  Feed footer          │ Inventory    │
│ Stats grid   │                       │              │
│ Badges       │                       │              │
└──────────────┴───────────────────────┴──────────────┘
```

---

## Design Tokens

```css
--bg: #111118; --card: rgba(255,255,255,0.065); --border: rgba(255,255,255,0.12);
--gold: #e08c0a; --gold-lt: #fbbf24; --text: #f1f5f9; --muted: #7a8394;
--green: #34d399; --blue: #60a5fa; --pink: #f472b6; --purple: #a78bfa;
```
Font: **Inter** · Border radius: 14px cards, 10px inner, 99px pills

---

## Components

| Component | Responsibility |
|-----------|---------------|
| `App` | Root state, localStorage sync |
| `TopBar` | App title + streak pill |
| `LeftPanel` | Cat card, level/XP, category bars, stats, badges |
| `CatCanvas` | Renders 14×20 pixel cat on `<canvas>` |
| `FeedPanel` | Date header, category filter, entry list, add button |
| `EntryCard` | Single log entry row |
| `AddEntryModal` | Form: title, category, points |
| `RightPanel` | Daily quests, random quest, inventory |
| `QuestCard` | Single quest row with tag + reward |
| `LevelUpToast` | Celebratory overlay on level-up |
| `useGameState` | Custom hook — all game logic + localStorage |
