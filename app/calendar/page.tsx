'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { timeUtils, analyticsUtils } from '@/lib/utils'

export default function CalendarPage() {
  const { categories, entries, goals } = useApp()
  const [selectedDate, setSelectedDate] = useState(timeUtils.getToday())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().split('T')[0])
  }

  const getDayStats = (date: string) => {
    const dayEntries = entries.filter(e => e.date === date)
    const totalTracked = dayEntries.reduce((sum, e) => sum + e.duration, 0)
    return { entries: dayEntries, totalTracked }
  }

  const selectedStats = analyticsUtils.calculateDailyStats(entries, selectedDate, categories)
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
        <p className="text-slate-600">View your tracked time by day</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition text-sm"
                >
                  ←
                </button>
                <button
                  onClick={nextMonth}
                  className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition text-sm"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-600 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map(date => {
                const dayStats = getDayStats(date)
                const isCurrentMonth =
                  new Date(date).getMonth() === currentMonth.getMonth() &&
                  new Date(date).getFullYear() === currentMonth.getFullYear()
                const isSelected = date === selectedDate
                const isToday = date === timeUtils.getToday()

                const topCategory = Object.entries(
                  dayStats.entries.reduce(
                    (acc, e) => {
                      acc[e.categoryId] = (acc[e.categoryId] || 0) + e.duration
                      return acc
                    },
                    {} as Record<string, number>
                  )
                ).sort((a, b) => b[1] - a[1])[0]

                const topCategoryColor = topCategory ? categories.find(c => c.id === topCategory[0])?.color : undefined

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-lg p-1 text-center transition border-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : isToday
                          ? 'border-slate-400 bg-slate-100'
                          : 'border-slate-200 bg-white'
                    } ${!isCurrentMonth ? 'opacity-25' : ''}`}
                  >
                    <div className={`text-xs font-semibold ${isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}`}>
                      {new Date(date).getDate()}
                    </div>
                    {topCategoryColor && dayStats.totalTracked > 0 && (
                      <div
                        className="h-1 rounded mt-1 mx-auto"
                        style={{
                          width: '70%',
                          backgroundColor: topCategoryColor,
                        }}
                      />
                    )}
                    <div className={`text-xs ${dayStats.totalTracked > 0 ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                      {(dayStats.totalTracked / 60).toFixed(1)}h
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
            <h3 className="text-lg font-semibold mb-4">
              {timeUtils.formatDate(selectedDate)}
            </h3>

            <div className="mb-6">
              <div className="text-sm text-slate-600 mb-1">Total Tracked</div>
              <div className="text-3xl font-bold">{timeUtils.formatDuration(selectedStats.totalTracked)}</div>
              <div className="text-xs text-slate-500 mt-1">
                {Math.round((selectedStats.totalTracked / (24 * 60)) * 100)}% of day
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold mb-3">Breakdown</div>
              {Object.entries(selectedStats.categoryBreakdown)
                .filter(([_, duration]) => duration > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([categoryId, duration]) => {
                  const category = categories.find(c => c.id === categoryId)
                  return (
                    <div key={categoryId} className="flex justify-between text-xs">
                      <span>{category?.icon} {category?.name}</span>
                      <span className="font-semibold" style={{ color: category?.color }}>
                        {timeUtils.formatDuration(duration)}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>

          {goals.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-sm font-semibold mb-3">Daily Goals Status</h3>
              <div className="space-y-2">
                {goals
                  .filter(g => g.active && g.period === 'daily')
                  .map(goal => {
                    const category = categories.find(c => c.id === goal.categoryId)
                    const categoryTime = (selectedStats.categoryBreakdown[goal.categoryId] || 0) / 60
                    const met = goal.type === 'minimum' ? categoryTime >= goal.targetHours : categoryTime <= goal.targetHours

                    return (
                      <div key={goal.id} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{category?.name}</span>
                          <span className={met ? 'text-green-600 font-bold' : 'text-slate-600'}>
                            {met ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
