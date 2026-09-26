'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Category, TimeEntry, Routine, Goal } from '@/lib/types'
import { StorageService } from '@/lib/storage'

interface AppContextType {
  categories: Category[]
  entries: TimeEntry[]
  routines: Routine[]
  goals: Goal[]
  activeTimer: { categoryId: string; startedAt: number } | null

  addEntry: (entry: TimeEntry) => void
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void
  deleteEntry: (id: string) => void

  updateCategory: (id: string, updates: Partial<Category>) => void
  addCategory: (category: Category) => void
  deleteCategory: (id: string) => void

  addRoutine: (routine: Routine) => void
  updateRoutine: (id: string, updates: Partial<Routine>) => void
  deleteRoutine: (id: string) => void

  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  startTimer: (categoryId: string) => void
  stopTimer: () => TimeEntry | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeTimer, setActiveTimer] = useState<{ categoryId: string; startedAt: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCategories(StorageService.getCategories())
    setEntries(StorageService.getEntries())
    setRoutines(StorageService.getRoutines())
    setGoals(StorageService.getGoals())
    setActiveTimer(StorageService.getActiveTimer())
    setMounted(true)
  }, [])

  const addEntry = (entry: TimeEntry) => {
    const updated = StorageService.addEntry(entry)
    setEntries(updated)
  }

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    const updated = StorageService.updateEntry(id, updates)
    setEntries(updated)
  }

  const deleteEntry = (id: string) => {
    const updated = StorageService.deleteEntry(id)
    setEntries(updated)
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map(c => (c.id === id ? { ...c, ...updates } : c))
    StorageService.saveCategories(updated)
    setCategories(updated)
  }

  const addCategory = (category: Category) => {
    const updated = [...categories, category]
    StorageService.saveCategories(updated)
    setCategories(updated)
  }

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id)
    StorageService.saveCategories(updated)
    setCategories(updated)
  }

  const addRoutine = (routine: Routine) => {
    const updated = [...routines, routine]
    StorageService.saveRoutines(updated)
    setRoutines(updated)
  }

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    const updated = routines.map(r => (r.id === id ? { ...r, ...updates } : r))
    StorageService.saveRoutines(updated)
    setRoutines(updated)
  }

  const deleteRoutine = (id: string) => {
    const updated = routines.filter(r => r.id !== id)
    StorageService.saveRoutines(updated)
    setRoutines(updated)
  }

  const addGoal = (goal: Goal) => {
    const updated = [...goals, goal]
    StorageService.saveGoals(updated)
    setGoals(updated)
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => (g.id === id ? { ...g, ...updates } : g))
    StorageService.saveGoals(updated)
    setGoals(updated)
  }

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id)
    StorageService.saveGoals(updated)
    setGoals(updated)
  }

  const startTimer = (categoryId: string) => {
    const timer = { categoryId, startedAt: Date.now() }
    StorageService.setActiveTimer(categoryId)
    setActiveTimer(timer)
  }

  const stopTimer = (): TimeEntry | null => {
    if (!activeTimer) return null

    const now = Date.now()
    const duration = Math.round((now - activeTimer.startedAt) / 1000 / 60)

    const today = new Date().toISOString().split('T')[0]
    const startDate = new Date(activeTimer.startedAt)
    const startTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`

    const endDate = new Date(now)
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

    const entry: TimeEntry = {
      id: `entry_${Date.now()}`,
      categoryId: activeTimer.categoryId,
      date: today,
      startTime,
      endTime,
      duration,
    }

    StorageService.clearActiveTimer()
    setActiveTimer(null)
    addEntry(entry)

    return entry
  }

  if (!mounted) {
    return <div className="bg-white" />
  }

  return (
    <AppContext.Provider
      value={{
        categories,
        entries,
        routines,
        goals,
        activeTimer,
        addEntry,
        updateEntry,
        deleteEntry,
        updateCategory,
        addCategory,
        deleteCategory,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        addGoal,
        updateGoal,
        deleteGoal,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
