# TimeTracker - 168 Hours

A personal time-tracking and time-analysis web app built with Next.js. Answer the question: **Where are your 168 hours actually going?**

## Features

### Core Tracking
- **Today Dashboard**: See your complete 24-hour day with time entries, untracked time, and category breakdown
- **Add Time Entries**: Quick manual entry with category, date, start/end times, and optional notes
- **Live Timer**: Start and stop a timer for current activities; automatically saves as an entry
- **Quick Edit/Delete**: Click any entry to edit or delete it instantly

### Categories
- 14 pre-configured default categories (Sleep, Work, Study, Phone, Exercise, Food, Friends, Family, Hobbies, Relaxation, Travel, Dating, Eat/Getting Ready, Personal)
- Customize with names, emoji icons, and colors
- Mark as active/inactive; max 20 categories

### Routines
- Recurring time blocks to reduce manual tracking
- Multiple time blocks per routine with day-of-week selection
- Example: Work (Mon-Fri 9-12, 1-5), Sleep (Daily 11pm-7am)

### Weekly View
- **168-Hour Breakdown**: Visual representation of your entire week
- Hours and percentage for each category
- Daily summary cards

### Analytics
- **Time by Category**: Detailed breakdown with daily averages
- **Week-over-Week Comparison**: Compare current vs. last week
- Category trends over time
- Period filters: Today, This Week, This Month

### Calendar
- Month view with color-coded tracked days
- Click any date for detailed breakdown
- Goal achievement indicators

### Goals
- **Minimum Goals**: "At least 4h friends/week"
- **Maximum Goals**: "No more than 14h phone/week"
- Daily, Weekly, or Monthly periods
- Progress bars and status tracking

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or next available port)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage (no backend)
- **State**: React Context API

## Project Structure

```
app/
  ├── components/          # Reusable UI components
  ├── page.tsx             # Today dashboard
  ├── week/                # Weekly view
  ├── analytics/           # Analytics
  ├── calendar/            # Calendar
  ├── routines/            # Routines
  ├── goals/               # Goals
  ├── categories/          # Settings
  ├── context.tsx          # App state (Context)
  └── layout.tsx           # Root layout with nav

lib/
  ├── types.ts             # TypeScript definitions
  ├── storage.ts           # localStorage service
  └── utils.ts             # Utilities for time/analytics
```

## Data Storage

All data stored in localStorage:
- `tt_categories`: Category definitions
- `tt_entries`: Time entries
- `tt_routines`: Routines
- `tt_goals`: Goals
- `tt_active_timer`: Current timer

**Privacy**: All data stays on your device. No server, no tracking.

## Browser Compatibility

Chrome/Edge 90+, Firefox 88+, Safari 14+

## License

MIT
