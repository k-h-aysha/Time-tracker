'use client'

import { useApp } from '@/app/context'
import { timeUtils, analyticsUtils } from '@/lib/utils'
import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeekPage() {
  const { categories, entries } = useApp()
  const [weekOffset, setWeekOffset] = useState(0)

  const today = timeUtils.getToday()
  const [year, month, day] = today.split('-').map(Number)
  const baseDate = new Date(year, month - 1, day)
  baseDate.setDate(baseDate.getDate() - weekOffset * 7)
  const baseDateStr = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}-${String(baseDate.getDate()).padStart(2, '0')}`
  const weekStart = timeUtils.getWeekStart(baseDateStr)
  const weekEnd = timeUtils.getWeekEnd(weekStart)

  const weekStats = analyticsUtils.calculateWeeklyStats(entries, weekStart, categories)
  const weekDates = timeUtils.getWeekDates(weekStart)
  const totalHours = 168

  const categoryStats = categories
    .map(cat => ({
      category: cat,
      minutes: weekStats.categoryBreakdown[cat.id] || 0,
    }))
    .filter(s => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const untracked = totalHours * 60 - weekStats.totalTracked

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.color || '#F5F5F5'
  }

  const getEntryForHour = (date: string, hour: number) => {
    const startTime = `${String(hour).padStart(2, '0')}:00`
    return entries.find(e => e.date === date && e.startTime === startTime)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'cursive' }}>
            Week
          </h1>
          <p className="text-slate-600">
            {timeUtils.formatDate(weekStart)} - {timeUtils.formatDate(timeUtils.getWeekEnd(weekStart))}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-4 py-2 border-2 border-slate-400 rounded hover:bg-slate-100 font-bold text-sm"
          >
            ← Prev
          </button>
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            className="px-4 py-2 border-2 border-slate-400 rounded hover:bg-slate-100 font-bold text-sm"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 border-4 rounded text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFE5F0', borderColor: '#94A3B8' }}>
          <div className="text-2xl font-bold">{(weekStats.totalTracked / 60).toFixed(1)}h</div>
          <div className="text-xs font-bold text-slate-600">Tracked</div>
        </div>

        <div className="p-4 border-4 rounded text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFE5F0', borderColor: '#94A3B8' }}>
          <div className="text-2xl font-bold">{(untracked / 60).toFixed(1)}h</div>
          <div className="text-xs font-bold text-slate-600">Untracked</div>
        </div>

        <div className="p-4 border-4 rounded text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFE5F0', borderColor: '#94A3B8' }}>
          <div className="text-2xl font-bold">168h</div>
          <div className="text-xs font-bold text-slate-600">Total</div>
        </div>

        <div className="p-4 border-4 rounded text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFE5F0', borderColor: '#94A3B8' }}>
          <div className="text-2xl font-bold">{entries.filter(e => e.date >= weekStart && e.date <= timeUtils.getWeekEnd(weekStart)).length}</div>
          <div className="text-xs font-bold text-slate-600">Entries</div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="p-6 rounded-lg border-4" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8', width: 'calc(100% + 250px)' }}>
        <h2 className="text-2xl font-bold mb-6">168 HOURS THIS WEEK</h2>

        <style>{`
          .week-box {
            border-radius: 12% 8% 11% 9% / 9% 11% 8% 12%;
            transform: rotate(${Math.random() * 3 - 1.5}deg);
          }
        `}</style>

        <div className="overflow-x-auto mb-6">
          <div className="inline-block">
            <div className="flex gap-3 mb-2">
              <div className="text-center font-bold text-xs text-slate-600" style={{ width: '60px' }}></div>
              {Array.from({ length: 24 }, (_, h) => h).map(hour => (
                <div key={`header-${hour}`} className="text-center flex-shrink-0" style={{ width: '40px' }}>
                  <div className="text-xs font-bold text-slate-600">{String(hour).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
            {weekDates.map((date, dateIdx) => (
              <div key={date} className="flex gap-3 mb-2 items-center">
                <div className="text-left pr-2 font-bold text-xs text-slate-600" style={{ width: '60px' }}>
                  <div>{DAYS[dateIdx]}</div>
                  <div>{date.split('-')[2]}</div>
                </div>
                {Array.from({ length: 24 }, (_, h) => h).map(hour => {
                  const entry = getEntryForHour(date, hour)
                  const bgColor = entry ? getCategoryColor(entry.categoryId) : '#F5F5F5'
                  const category = entry ? categories.find(c => c.id === entry.categoryId) : null
                  const rotations = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.5, -1.3]
                  const borderRadii = [
                    '14% 9% 12% 10%',
                    '10% 13% 9% 12%',
                    '11% 10% 13% 9%',
                    '9% 12% 10% 13%',
                    '12% 11% 10% 9%',
                    '10% 9% 12% 11%',
                    '13% 10% 11% 9%',
                  ]
                  return (
                    <div
                      key={`${date}-${hour}`}
                      className="flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: bgColor,
                          color: bgColor === '#F5F5F5' ? '#999' : '#FFF',
                          border: '2px solid #64748b',
                          borderRadius: borderRadii[dateIdx % borderRadii.length] + ' / ' + borderRadii[(dateIdx + 1) % borderRadii.length],
                          transform: `rotate(${rotations[dateIdx % rotations.length]}deg)`,
                          boxShadow: '1px 2px 3px rgba(0,0,0,0.08)',
                        }}
                        title={category ? category.name : 'Empty'}
                      >
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {categoryStats.map(stat => {
            const hours = stat.minutes / 60
            const percentage = (stat.minutes / (168 * 60)) * 100

            return (
              <div key={stat.category.id} className="flex items-center gap-4">
                <div className="w-32 flex items-center gap-2">
                  <span className="text-xl">{stat.category.icon}</span>
                  <span className="font-bold text-sm">{stat.category.name}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-slate-300 h-6 rounded border-2 border-slate-400" style={{ position: 'relative' }}>
                    <div
                      className="h-6 rounded border-r-2 border-slate-600"
                      style={{
                        width: `${Math.max(2, percentage)}%`,
                        backgroundColor: stat.category.color,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <div className="font-bold text-lg" style={{ color: stat.category.color }}>
                    {hours.toFixed(1)}h
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
