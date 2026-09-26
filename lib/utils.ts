import { TimeEntry, Category, Routine, DailyStats, WeeklyStats } from './types'

export const timeUtils = {
  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  },

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  },

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  },

  calculateDuration(startTime: string, endTime: string): number {
    let start = this.parseTime(startTime)
    let end = this.parseTime(endTime)
    if (end <= start) end += 24 * 60
    return end - start
  },

  getDayName(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
  },

  getWeekStart(date: string): string {
    const d = new Date(date + 'T00:00:00')
    d.setDate(d.getDate() - d.getDay() + 1)
    return d.toISOString().split('T')[0]
  },

  getWeekEnd(date: string): string {
    const d = new Date(date + 'T00:00:00')
    d.setDate(d.getDate() - d.getDay() + 7)
    return d.toISOString().split('T')[0]
  },

  getWeekDates(startDate: string): string[] {
    const dates = []
    const d = new Date(startDate + 'T00:00:00')
    for (let i = 0; i < 7; i++) {
      dates.push(d.toISOString().split('T')[0])
      d.setDate(d.getDate() + 1)
    }
    return dates
  },

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  },

  formatDate(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  },
}

export const analyticsUtils = {
  calculateDailyStats(entries: TimeEntry[], date: string, categories: Category[]): DailyStats {
    const dayEntries = entries.filter(e => e.date === date)
    const categoryBreakdown: Record<string, number> = {}

    categories.forEach(cat => {
      categoryBreakdown[cat.id] = 0
    })

    dayEntries.forEach(entry => {
      categoryBreakdown[entry.categoryId] = (categoryBreakdown[entry.categoryId] || 0) + entry.duration
    })

    const totalTracked = dayEntries.reduce((sum, e) => sum + e.duration, 0)

    return {
      date,
      totalTracked,
      entries: dayEntries,
      categoryBreakdown,
    }
  },

  calculateWeeklyStats(entries: TimeEntry[], weekStart: string, categories: Category[]): WeeklyStats {
    const weekEnd = timeUtils.getWeekEnd(weekStart)
    const weekEntries = entries.filter(e => e.date >= weekStart && e.date <= weekEnd)
    const weekDates = timeUtils.getWeekDates(weekStart)

    const categoryBreakdown: Record<string, number> = {}
    categories.forEach(cat => {
      categoryBreakdown[cat.id] = 0
    })

    weekEntries.forEach(entry => {
      categoryBreakdown[entry.categoryId] = (categoryBreakdown[entry.categoryId] || 0) + entry.duration
    })

    const totalTracked = weekEntries.reduce((sum, e) => sum + e.duration, 0)
    const totalHours = totalTracked / 60

    const dailyStats = weekDates.map(date => this.calculateDailyStats(entries, date, categories))

    return {
      weekStart,
      totalTracked,
      totalHours,
      categoryBreakdown,
      dailyStats,
    }
  },

  getCategoryStats(entries: TimeEntry[], categoryId: string, weekStart: string, categories: Category[]) {
    const weekEnd = timeUtils.getWeekEnd(weekStart)
    const categoryEntries = entries.filter(
      e => e.categoryId === categoryId && e.date >= weekStart && e.date <= weekEnd
    )
    const totalMinutes = categoryEntries.reduce((sum, e) => sum + e.duration, 0)
    const totalHours = totalMinutes / 60
    const dailyAverage = totalHours / 7

    return {
      totalHours,
      dailyAverage,
      entries: categoryEntries,
    }
  },

  generateTrendData(entries: TimeEntry[], categoryId: string, weeksBack: number = 12) {
    const data = []
    const today = new Date()

    for (let i = weeksBack - 1; i >= 0; i--) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - i * 7)
      const weekStartStr = weekStart.toISOString().split('T')[0]
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const weekEndStr = weekEnd.toISOString().split('T')[0]

      const weekEntries = entries.filter(e => e.categoryId === categoryId && e.date >= weekStartStr && e.date <= weekEndStr)
      const hours = weekEntries.reduce((sum, e) => sum + e.duration, 0) / 60

      const weekNum = `W${Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / 604800000)}`
      data.push({ week: weekNum, hours: Math.round(hours * 10) / 10 })
    }

    return data
  },
}
