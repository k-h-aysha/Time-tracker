'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { timeUtils, analyticsUtils } from '@/lib/utils'
import { TimeEntry } from '@/lib/types'

export default function TodayPage() {
  const { categories, entries, addEntry, updateEntry, deleteEntry } = useApp()
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '')
  const today = timeUtils.getToday()
  const dailyStats = analyticsUtils.calculateDailyStats(entries, today, categories)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const entryMap = new Map(dailyStats.entries.map(e => [e.startTime, e]))
  const hourEntries = hours.map(h => entryMap.get(`${String(h).padStart(2, '0')}:00`))

  const handleHourClick = (hour: number) => {
    const startTime = `${String(hour).padStart(2, '0')}:00`
    const endTime = `${String((hour + 1) % 24).padStart(2, '0')}:00`
    const existingEntry = hourEntries[hour]

    if (existingEntry) {
      updateEntry(existingEntry.id, { categoryId: selectedCategory })
    } else {
      const newEntry: TimeEntry = {
        id: `entry_${Date.now()}_${hour}`,
        categoryId: selectedCategory,
        date: today,
        startTime,
        endTime,
        duration: 60,
      }
      addEntry(newEntry)
    }
  }

  const handleHourClear = (hour: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const existingEntry = hourEntries[hour]
    if (existingEntry) {
      deleteEntry(existingEntry.id)
    }
  }

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.color || '#F5F5F5'
  }

  const trackingStats = categories.map(cat => ({
    category: cat,
    hours: (dailyStats.categoryBreakdown[cat.id] || 0) / 60,
  }))

  const totalTracked = dailyStats.totalTracked / 60
  const untracked = 24 - totalTracked

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#FFB6D9' }}>
          {timeUtils.formatDate(today)}
        </h1>
      </div>

      <div>
        <label className="block text-base font-bold mb-3">Select Category:</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold transition border-3 bg-white flex items-center gap-2 ${
                selectedCategory === cat.id ? 'border-slate-900 scale-105' : 'border-slate-400 hover:border-slate-600'
              }`}
              style={{
                borderColor: selectedCategory === cat.id ? '#1F2937' : '#94A3B8',
              }}
              title={cat.name}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                style={{ backgroundColor: getCategoryColor(cat.id), borderColor: '#9CA3AF' }}
              />
              <span style={{ color: '#1F2937' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg border-4" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
        <p className="text-xs text-slate-600 mb-3">Click a box to assign to {categories.find(c => c.id === selectedCategory)?.name}, right-click to clear</p>

          <style>{`
            .scrapbook-box {
              border-radius: ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}% / ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}% ${Math.random() * 20 + 5}%;
              transform: rotate(${Math.random() * 4 - 2}deg);
            }
            .scrapbook-box:nth-child(1) { border-radius: 15% 8% 12% 10% / 10% 14% 8% 12%; transform: rotate(-1.5deg); }
            .scrapbook-box:nth-child(2) { border-radius: 10% 15% 8% 12% / 12% 10% 14% 8%; transform: rotate(1deg); }
            .scrapbook-box:nth-child(3) { border-radius: 12% 10% 15% 8% / 8% 12% 10% 15%; transform: rotate(-0.5deg); }
            .scrapbook-box:nth-child(4) { border-radius: 8% 12% 10% 15% / 15% 8% 12% 10%; transform: rotate(1.5deg); }
            .scrapbook-box:nth-child(5) { border-radius: 14% 9% 11% 10% / 11% 13% 9% 12%; transform: rotate(-1deg); }
            .scrapbook-box:nth-child(6) { border-radius: 10% 14% 12% 9% / 9% 11% 13% 10%; transform: rotate(0.8deg); }
            .scrapbook-box:nth-child(7) { border-radius: 11% 10% 14% 9% / 10% 12% 11% 14%; transform: rotate(-1.2deg); }
            .scrapbook-box:nth-child(8) { border-radius: 13% 11% 9% 12% / 12% 9% 13% 11%; transform: rotate(1.3deg); }
            .scrapbook-box:nth-child(9) { border-radius: 9% 13% 11% 10% / 10% 14% 9% 12%; transform: rotate(-0.7deg); }
            .scrapbook-box:nth-child(10) { border-radius: 12% 9% 13% 11% / 11% 10% 12% 9%; transform: rotate(1.1deg); }
            .scrapbook-box:nth-child(11) { border-radius: 10% 12% 9% 13% / 13% 11% 10% 9%; transform: rotate(-1.4deg); }
            .scrapbook-box:nth-child(12) { border-radius: 15% 10% 11% 9% / 9% 12% 15% 11%; transform: rotate(0.6deg); }
            .scrapbook-box:nth-child(13) { border-radius: 11% 15% 9% 10% / 10% 9% 11% 15%; transform: rotate(-0.9deg); }
            .scrapbook-box:nth-child(14) { border-radius: 9% 11% 12% 10% / 12% 15% 9% 10%; transform: rotate(1.2deg); }
            .scrapbook-box:nth-child(15) { border-radius: 13% 9% 10% 12% / 9% 10% 13% 12%; transform: rotate(-1.1deg); }
            .scrapbook-box:nth-child(16) { border-radius: 10% 13% 11% 9% / 11% 9% 10% 13%; transform: rotate(0.8deg); }
            .scrapbook-box:nth-child(17) { border-radius: 12% 10% 9% 13% / 13% 12% 10% 9%; transform: rotate(-0.6deg); }
            .scrapbook-box:nth-child(18) { border-radius: 9% 12% 13% 10% / 10% 13% 12% 9%; transform: rotate(1.3deg); }
            .scrapbook-box:nth-child(19) { border-radius: 11% 9% 12% 13% / 12% 10% 9% 11%; transform: rotate(-1.2deg); }
            .scrapbook-box:nth-child(20) { border-radius: 10% 11% 13% 9% / 9% 11% 13% 10%; transform: rotate(0.9deg); }
            .scrapbook-box:nth-child(21) { border-radius: 13% 12% 10% 11% / 11% 9% 12% 13%; transform: rotate(-0.8deg); }
            .scrapbook-box:nth-child(22) { border-radius: 12% 11% 9% 10% / 10% 12% 11% 9%; transform: rotate(1.1deg); }
            .scrapbook-box:nth-child(23) { border-radius: 9% 10% 11% 12% / 12% 11% 10% 9%; transform: rotate(-1.3deg); }
            .scrapbook-box:nth-child(24) { border-radius: 11% 9% 10% 12% / 13% 10% 9% 11%; transform: rotate(0.7deg); }
          `}</style>

        <div className="grid grid-cols-12 gap-4 pb-4 w-full">
          {hours.map(hour => {
            const entry = hourEntries[hour]
            const bgColor = entry ? getCategoryColor(entry.categoryId) : '#FFFFFF'
            const category = entry ? categories.find(c => c.id === entry.categoryId) : null

            const formatHour = (h: number) => {
              if (h === 0) return '12am'
              if (h < 12) return `${h}am`
              if (h === 12) return '12pm'
              return `${h - 12}pm`
            }

            return (
              <div
                key={hour}
                className="text-center"
              >
                <button
                  onClick={() => handleHourClick(hour)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    handleHourClear(hour, e as any)
                  }}
                  className="scrapbook-box w-full aspect-square font-bold text-lg transition hover:scale-110 hover:shadow-lg"
                  style={{
                    backgroundColor: bgColor,
                    color: bgColor === '#FFFFFF' ? '#999' : '#FFF',
                    border: '2.5px solid #64748b',
                    boxShadow: '2px 3px 4px rgba(0,0,0,0.1)',
                    minHeight: '70px',
                  }}
                  title={category ? category.name : 'Empty'}
                >
                </button>
                <div className="text-sm font-semibold mt-2 text-slate-700">
                  {formatHour(hour)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-slate-400">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#1F2937' }}>
              {totalTracked.toFixed(1)}h
            </div>
            <div className="text-xs font-semibold text-slate-600">Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#EF4444' }}>
              {untracked.toFixed(1)}h
            </div>
            <div className="text-xs font-semibold text-slate-600">Untracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
              24h
            </div>
            <div className="text-xs font-semibold text-slate-600">Total</div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg border-4" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
        <h3 className="text-lg font-bold mb-4">Today's Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          {trackingStats
            .filter(s => s.hours > 0)
            .sort((a, b) => b.hours - a.hours)
            .map(stat => (
              <div key={stat.category.id} className="flex items-center gap-3 p-3 bg-white border-2 border-slate-300 rounded">
                <div
                  className="w-6 h-6 rounded border-2 border-slate-400"
                  style={{ backgroundColor: stat.category.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{stat.category.name}</div>
                  <div className="text-xs text-slate-600">{stat.hours.toFixed(1)}h</div>
                </div>
              </div>
            ))}
          {trackingStats.filter(s => s.hours > 0).length === 0 && (
            <div className="col-span-2 text-center text-slate-500 py-4 text-sm">
              Click boxes above to start tracking
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
