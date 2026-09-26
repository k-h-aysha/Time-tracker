'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { timeUtils, analyticsUtils } from '@/lib/utils'

export default function AnalyticsPage() {
  const { categories, entries } = useApp()
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const today = timeUtils.getToday()
  const weekStart = timeUtils.getWeekStart(today)
  const lastWeekStart = new Date(weekStart + 'T00:00:00')
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0]

  const thisWeek = analyticsUtils.calculateWeeklyStats(entries, weekStart, categories)
  const lastWeek = analyticsUtils.calculateWeeklyStats(entries, lastWeekStartStr, categories)

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const comparisonCategories = selectedCategories.length > 0 ? selectedCategories : categories.slice(0, 3).map(c => c.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-slate-600">Analyze your time patterns and trends</p>
      </div>

      <div className="flex gap-3 border-b border-slate-200 pb-4">
        {(['today', 'week', 'month'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 font-medium transition capitalize ${
              period === p ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-lg p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Time by Category</h2>

        <div className="space-y-4">
          {categories
            .map(cat => ({
              category: cat,
              thisWeekMinutes: thisWeek.categoryBreakdown[cat.id] || 0,
              lastWeekMinutes: lastWeek.categoryBreakdown[cat.id] || 0,
            }))
            .filter(s => s.thisWeekMinutes > 0 || s.lastWeekMinutes > 0)
            .sort((a, b) => b.thisWeekMinutes - a.thisWeekMinutes)
            .map(stat => {
              const thisWeekHours = stat.thisWeekMinutes / 60
              const lastWeekHours = stat.lastWeekMinutes / 60
              const change = thisWeekHours - lastWeekHours
              const changePercent = lastWeekHours > 0 ? (change / lastWeekHours) * 100 : 0

              return (
                <div key={stat.category.id} className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stat.category.icon}</span>
                      <div>
                        <div className="font-semibold">{stat.category.name}</div>
                        <div className="text-xs text-slate-500">
                          {thisWeekHours.toFixed(1)}h this week
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: stat.category.color }}>
                        {thisWeekHours.toFixed(1)}h
                      </div>
                      <div className={`text-xs font-medium ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}h ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">This week</div>
                      <div className="w-full bg-slate-200 rounded h-2" style={{ backgroundColor: '#E5E7EB' }}>
                        <div
                          className="h-2 rounded"
                          style={{
                            width: `${Math.min(100, (thisWeekHours / 12) * 100)}%`,
                            backgroundColor: stat.category.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Last week</div>
                      <div className="w-full bg-slate-200 rounded h-2" style={{ backgroundColor: '#E5E7EB' }}>
                        <div
                          className="h-2 rounded opacity-50"
                          style={{
                            width: `${Math.min(100, (lastWeekHours / 12) * 100)}%`,
                            backgroundColor: stat.category.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-8 border-2 border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Week-over-Week Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-right py-3 px-4 font-semibold">This Week</th>
                <th className="text-right py-3 px-4 font-semibold">Last Week</th>
                <th className="text-right py-3 px-4 font-semibold">Change</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .map(cat => ({
                  category: cat,
                  thisWeekMinutes: thisWeek.categoryBreakdown[cat.id] || 0,
                  lastWeekMinutes: lastWeek.categoryBreakdown[cat.id] || 0,
                }))
                .filter(s => s.thisWeekMinutes > 0 || s.lastWeekMinutes > 0)
                .sort((a, b) => b.thisWeekMinutes - a.thisWeekMinutes)
                .map(stat => {
                  const thisWeekHours = stat.thisWeekMinutes / 60
                  const lastWeekHours = stat.lastWeekMinutes / 60
                  const change = thisWeekHours - lastWeekHours

                  return (
                    <tr key={stat.category.id} className="border-b border-slate-200 hover:bg-white">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <span>{stat.category.icon}</span>
                        <span className="font-medium">{stat.category.name}</span>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">{thisWeekHours.toFixed(1)}h</td>
                      <td className="text-right py-3 px-4 text-slate-600">{lastWeekHours.toFixed(1)}h</td>
                      <td className={`text-right py-3 px-4 font-semibold ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}h
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
