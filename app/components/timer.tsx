'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/app/context'
import { CategoryBadge } from './category-badge'

export function Timer() {
  const { categories, activeTimer, startTimer, stopTimer } = useApp()
  const [selected, setSelected] = useState(categories[0]?.id || '')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeTimer) return

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = now - activeTimer.startedAt
      setElapsed(Math.floor(diff / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimer])

  const handleStart = () => {
    startTimer(selected)
    setElapsed(0)
  }

  const handleStop = () => {
    stopTimer()
    setElapsed(0)
  }

  const activeCategory = categories.find(c => c.id === selected || (activeTimer && c.id === activeTimer.categoryId))
  const displayCategory = activeTimer ? categories.find(c => c.id === activeTimer.categoryId) : activeCategory

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const hours = Math.floor(minutes / 60)

  return (
    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-8 border-2 border-slate-200">
      <h3 className="text-lg font-semibold mb-6">Quick Timer</h3>

      {!activeTimer ? (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Select category</label>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className="cursor-pointer"
                >
                  <CategoryBadge category={cat} selected={selected === cat.id} asDiv />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
          >
            Start Timer
          </button>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            {displayCategory && <CategoryBadge category={displayCategory} />}
          </div>

          <div className="text-5xl font-bold text-center mb-6 font-mono tracking-tight">
            {String(hours).padStart(2, '0')}:{String(minutes % 60).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <button
            onClick={handleStop}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-lg"
          >
            Stop & Save
          </button>
        </>
      )}
    </div>
  )
}
