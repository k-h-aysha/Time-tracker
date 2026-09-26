'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { TimeEntry } from '@/lib/types'
import { timeUtils } from '@/lib/utils'
import { CategoryBadge } from './category-badge'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialDate?: string
}

export function AddEntryModal({ isOpen, onClose, initialDate }: Props) {
  const { categories, addEntry } = useApp()
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '')
  const [date, setDate] = useState(initialDate || timeUtils.getToday())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entry: TimeEntry = {
      id: `entry_${Date.now()}`,
      categoryId: selectedCategory,
      date,
      startTime,
      endTime,
      duration: timeUtils.calculateDuration(startTime, endTime),
      note: note || undefined,
    }

    addEntry(entry)
    onClose()
    setNote('')
  }

  if (!isOpen) return null

  const category = categories.find(c => c.id === selectedCategory)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Add Time Entry</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="cursor-pointer"
                >
                  <CategoryBadge category={cat} selected={selectedCategory === cat.id} asDiv />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <div className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium">
              {timeUtils.formatDuration(timeUtils.calculateDuration(startTime, endTime))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Note (optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
