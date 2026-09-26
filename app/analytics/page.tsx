'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { timeUtils } from '@/lib/utils'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type ViewMode = 'daily' | 'weekly'

export default function AnalyticsPage() {
  const { categories, entries } = useApp()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [comparisonCategoryIds, setComparisonCategoryIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('weekly')

  const toggleComparisonCategory = (categoryId: string) => {
    setComparisonCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getTrendData = (catIds: string[]) => {
    if (viewMode === 'daily') {
      const data: any[] = []
      const today = timeUtils.getToday()
      const [year, month, day] = today.split('-').map(Number)
      const currentDate = new Date(year, month - 1, day)

      for (let i = 27; i >= 0; i--) {
        const d = new Date(currentDate)
        d.setDate(d.getDate() - i)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

        const dayEntries = entries.filter(e => e.date === dateStr)
        const point: any = { date: dayName, dateStr }

        catIds.forEach(catId => {
          const catEntries = dayEntries.filter(e => e.categoryId === catId)
          const hours = catEntries.reduce((sum, e) => sum + e.duration, 0) / 60
          point[catId] = parseFloat(hours.toFixed(1))
        })

        data.push(point)
      }
      return data
    } else {
      const data: any[] = []
      const today = timeUtils.getToday()
      const [year, month, day] = today.split('-').map(Number)
      const currentDate = new Date(year, month - 1, day)

      for (let i = 11; i >= 0; i--) {
        const d = new Date(currentDate)
        d.setDate(d.getDate() - d.getDay() + 1 - i * 7)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const weekEnd = new Date(d)
        weekEnd.setDate(weekEnd.getDate() + 6)

        const weekEntries = entries.filter(e => {
          const [eyear, emonth, eday] = e.date.split('-').map(Number)
          const entryDate = new Date(eyear, emonth - 1, eday)
          return entryDate >= d && entryDate <= weekEnd
        })

        const weekNum = `W${Math.ceil((d.getDate() + 6) / 7)}`
        const point: any = { week: weekNum }

        catIds.forEach(catId => {
          const catEntries = weekEntries.filter(e => e.categoryId === catId)
          const hours = catEntries.reduce((sum, e) => sum + e.duration, 0) / 60
          point[catId] = parseFloat(hours.toFixed(1))
        })

        data.push(point)
      }
      return data
    }
  }

  const trendChartData = getTrendData(selectedCategoryId ? [selectedCategoryId] : [])
  const comparisonChartData = getTrendData(comparisonCategoryIds)
  const comparisonColors = comparisonCategoryIds.map(id => categories.find(c => c.id === id)?.color || '#999')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>Analytics</h1>
        <p className="text-slate-600">Track your time trends over days and weeks</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('weekly')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            viewMode === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode('daily')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            viewMode === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Daily
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? '' : cat.id)}
              className={`px-4 py-2 rounded-full border-2 font-semibold transition flex items-center gap-2 ${
                selectedCategoryId === cat.id
                  ? 'bg-white border-slate-900 scale-105'
                  : 'bg-white border-slate-300 hover:border-slate-400'
              }`}
              style={{
                borderColor: selectedCategoryId === cat.id ? cat.color : '#CBD5E1',
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: cat.color, borderColor: '#9CA3AF' }}
              />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {selectedCategoryId ? (
          <div className="p-6 rounded-lg border-4" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendChartData}>
                <defs>
                  <linearGradient id="gradient-trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={categories.find(c => c.id === selectedCategoryId)?.color || '#999'} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={categories.find(c => c.id === selectedCategoryId)?.color || '#999'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey={viewMode === 'daily' ? 'date' : 'week'}
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFBF0',
                    border: '2px solid #94A3B8',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => `${value}h`}
                />
                <Area
                  type="monotone"
                  dataKey={selectedCategoryId}
                  stroke={categories.find(c => c.id === selectedCategoryId)?.color || '#999'}
                  fill="url(#gradient-trend)"
                  strokeWidth={2}
                  dot={{ fill: categories.find(c => c.id === selectedCategoryId)?.color || '#999', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 rounded-lg border-4 text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
            <p className="text-slate-600 text-lg">Select a category to see trends</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Comparison</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleComparisonCategory(cat.id)}
              className={`px-4 py-2 rounded-full border-2 font-semibold transition flex items-center gap-2 ${
                comparisonCategoryIds.includes(cat.id)
                  ? 'bg-white border-slate-900 scale-105'
                  : 'bg-white border-slate-300 hover:border-slate-400'
              }`}
              style={{
                borderColor: comparisonCategoryIds.includes(cat.id) ? cat.color : '#CBD5E1',
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{ backgroundColor: cat.color, borderColor: '#9CA3AF' }}
              />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {comparisonCategoryIds.length > 0 ? (
          <div className="p-6 rounded-lg border-4" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey={viewMode === 'daily' ? 'date' : 'week'}
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFBF0',
                    border: '2px solid #94A3B8',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => `${value}h`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => categories.find(c => c.id === value)?.name || value}
                />
                {comparisonCategoryIds.map((catId, idx) => (
                  <Line
                    key={catId}
                    type="monotone"
                    dataKey={catId}
                    stroke={comparisonColors[idx]}
                    strokeWidth={2}
                    dot={{ fill: comparisonColors[idx], r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 rounded-lg border-4 text-center" style={{ borderStyle: 'dashed', backgroundColor: '#FFFBF0', borderColor: '#94A3B8' }}>
            <p className="text-slate-600">Select 2+ categories to compare</p>
          </div>
        )}
      </div>
    </div>
  )
}
