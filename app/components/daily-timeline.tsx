'use client'

import { useApp } from '@/app/context'
import { TimeEntry, Category } from '@/lib/types'
import { timeUtils } from '@/lib/utils'

interface Props {
  date: string
  entries: TimeEntry[]
  onEditEntry: (entry: TimeEntry) => void
}

export function DailyTimeline({ date, entries, onEditEntry }: Props) {
  const { categories } = useApp()

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.color || '#CCCCCC'
  }

  const getCategoryName = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Other'
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayEntries = entries.sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{timeUtils.formatDate(date)} Timeline</h3>

      <div className="space-y-2">
        {dayEntries.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <p>No entries tracked yet</p>
            <p className="text-sm mt-1">Start your day by adding time entries or using the timer</p>
          </div>
        ) : (
          dayEntries.map(entry => {
            const startMinutes = timeUtils.parseTime(entry.startTime)
            const duration = entry.duration
            const position = (startMinutes / (24 * 60)) * 100
            const width = (duration / (24 * 60)) * 100

            return (
              <button
                key={entry.id}
                onClick={() => onEditEntry(entry)}
                className="block w-full text-left transition hover:opacity-75"
                title={entry.note}
              >
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100">
                  <div className="w-2 h-10 rounded" style={{ backgroundColor: getCategoryColor(entry.categoryId) }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{getCategoryName(entry.categoryId)}</div>
                    <div className="text-xs text-slate-600">
                      {entry.startTime} - {entry.endTime} ({timeUtils.formatDuration(entry.duration)})
                    </div>
                    {entry.note && <div className="text-xs text-slate-500 truncate">{entry.note}</div>}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
