export interface Category {
  id: string
  name: string
  color: string
  icon: string
  active: boolean
  order: number
}

export interface TimeEntry {
  id: string
  categoryId: string
  date: string // ISO date
  startTime: string // HH:mm
  endTime: string // HH:mm
  duration: number // minutes
  note?: string
}

export interface Routine {
  id: string
  name: string
  categoryId: string
  active: boolean
  timeBlocks: RoutineTimeBlock[]
}

export interface RoutineTimeBlock {
  id: string
  startTime: string // HH:mm
  endTime: string // HH:mm
  recurringDays: number[] // 0-6, Monday=0
}

export interface Goal {
  id: string
  name: string
  categoryId: string
  type: 'minimum' | 'maximum'
  targetHours: number
  period: 'daily' | 'weekly' | 'monthly'
  active: boolean
  createdAt: string
}

export interface DailyStats {
  date: string
  totalTracked: number // minutes
  entries: TimeEntry[]
  categoryBreakdown: Record<string, number> // categoryId -> minutes
}

export interface WeeklyStats {
  weekStart: string // ISO date
  totalTracked: number
  totalHours: number
  categoryBreakdown: Record<string, number>
  dailyStats: DailyStats[]
}
