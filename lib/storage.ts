import { Category, TimeEntry, Routine, Goal } from './types'

const STORAGE_KEYS = {
  CATEGORIES: 'tt_categories',
  ENTRIES: 'tt_entries',
  ROUTINES: 'tt_routines',
  GOALS: 'tt_goals',
  ACTIVE_TIMER: 'tt_active_timer',
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'sleep', name: 'Sleep', color: '#6B8DD6', icon: '😴', active: true, order: 0 },
  { id: 'work', name: 'Work', color: '#D4A574', icon: '💼', active: true, order: 1 },
  { id: 'study', name: 'Study', color: '#8B7AA6', icon: '📚', active: true, order: 2 },
  { id: 'phone', name: 'Phone', color: '#333333', icon: '📱', active: true, order: 3 },
  { id: 'exercise', name: 'Exercise', color: '#F4B942', icon: '🏃', active: true, order: 4 },
  { id: 'food', name: 'Food', color: '#E89B6C', icon: '🍽️', active: true, order: 5 },
  { id: 'friends', name: 'Friends', color: '#D84C8D', icon: '👯', active: true, order: 6 },
  { id: 'family', name: 'Family', color: '#1F3A93', icon: '👨‍👩‍👧', active: true, order: 7 },
  { id: 'hobbies', name: 'Hobbies', color: '#5FD4D4', icon: '🎮', active: true, order: 8 },
  { id: 'relaxation', name: 'Relaxation', color: '#A8D4A0', icon: '🧘', active: true, order: 9 },
  { id: 'travel', name: 'Travel', color: '#9B8FBE', icon: '✈️', active: true, order: 10 },
  { id: 'dating', name: 'Dating', color: '#E87B6B', icon: '💕', active: true, order: 11 },
  { id: 'eat_getting_ready', name: 'Eat, Getting Ready', color: '#E89B6C', icon: '🪒', active: true, order: 12 },
  { id: 'personal', name: 'Personal', color: '#C9A0DC', icon: '🔧', active: true, order: 13 },
  { id: 'other', name: 'Other', color: '#CCCCCC', icon: '📌', active: true, order: 14 },
]

export const StorageService = {
  // Categories
  getCategories(): Category[] {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
  },

  saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },

  // Time Entries
  getEntries(): TimeEntry[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES)
    return stored ? JSON.parse(stored) : []
  },

  saveEntries(entries: TimeEntry[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries))
  },

  addEntry(entry: TimeEntry): TimeEntry[] {
    const entries = this.getEntries()
    entries.push(entry)
    this.saveEntries(entries)
    return entries
  },

  updateEntry(id: string, updates: Partial<TimeEntry>): TimeEntry[] {
    const entries = this.getEntries()
    const index = entries.findIndex(e => e.id === id)
    if (index >= 0) {
      entries[index] = { ...entries[index], ...updates }
    }
    this.saveEntries(entries)
    return entries
  },

  deleteEntry(id: string): TimeEntry[] {
    const entries = this.getEntries().filter(e => e.id !== id)
    this.saveEntries(entries)
    return entries
  },

  getEntriesByDate(date: string): TimeEntry[] {
    return this.getEntries().filter(e => e.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime))
  },

  // Routines
  getRoutines(): Routine[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.ROUTINES)
    return stored ? JSON.parse(stored) : []
  },

  saveRoutines(routines: Routine[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines))
  },

  // Goals
  getGoals(): Goal[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.GOALS)
    return stored ? JSON.parse(stored) : []
  },

  saveGoals(goals: Goal[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
  },

  // Timer
  getActiveTimer(): { categoryId: string; startedAt: number } | null {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER)
    return stored ? JSON.parse(stored) : null
  },

  setActiveTimer(categoryId: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify({ categoryId, startedAt: Date.now() }))
  },

  clearActiveTimer(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER)
  },
}
