'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { Routine, RoutineTimeBlock } from '@/lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function RoutinesPage() {
  const { categories, routines, addRoutine, updateRoutine, deleteRoutine } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [timeBlocks, setTimeBlocks] = useState<RoutineTimeBlock[]>([
    { id: '1', startTime: '09:00', endTime: '17:00', recurringDays: [1, 2, 3, 4, 5] },
  ])

  const handleAddTimeBlock = () => {
    setTimeBlocks([
      ...timeBlocks,
      {
        id: `block_${Date.now()}`,
        startTime: '09:00',
        endTime: '10:00',
        recurringDays: selectedDays,
      },
    ])
  }

  const handleUpdateTimeBlock = (id: string, field: string, value: any) => {
    setTimeBlocks(
      timeBlocks.map(block => (block.id === id ? { ...block, [field]: value } : block))
    )
  }

  const handleRemoveTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !categoryId) return

    const routine: Routine = {
      id: editingId || `routine_${Date.now()}`,
      name,
      categoryId,
      active: true,
      timeBlocks,
    }

    if (editingId) {
      updateRoutine(editingId, routine)
    } else {
      addRoutine(routine)
    }

    resetForm()
  }

  const resetForm = () => {
    setName('')
    setCategoryId(categories[0]?.id || '')
    setSelectedDays([1, 2, 3, 4, 5])
    setTimeBlocks([{ id: '1', startTime: '09:00', endTime: '17:00', recurringDays: [1, 2, 3, 4, 5] }])
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Routines</h1>
          <p className="text-slate-600">Set up recurring time blocks to reduce manual tracking</p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add Routine
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Routine Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Work Schedule"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Recurring Days</label>
            <div className="flex gap-2">
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (selectedDays.includes(i)) {
                      setSelectedDays(selectedDays.filter(d => d !== i))
                    } else {
                      setSelectedDays([...selectedDays, i])
                    }
                  }}
                  className={`px-3 py-2 rounded font-medium transition ${
                    selectedDays.includes(i)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium">Time Blocks</label>
              <button
                type="button"
                onClick={handleAddTimeBlock}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Block
              </button>
            </div>

            <div className="space-y-3">
              {timeBlocks.map((block, idx) => (
                <div key={block.id} className="bg-white rounded-lg p-4 border border-slate-300 flex gap-3 items-end">
                  <input
                    type="time"
                    value={block.startTime}
                    onChange={e => handleUpdateTimeBlock(block.id, 'startTime', e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded flex-1"
                  />
                  <span className="text-slate-600 font-medium">-</span>
                  <input
                    type="time"
                    value={block.endTime}
                    onChange={e => handleUpdateTimeBlock(block.id, 'endTime', e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded flex-1"
                  />
                  {timeBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeBlock(block.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editingId ? 'Update' : 'Create'} Routine
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {routines.map(routine => {
          const category = categories.find(c => c.id === routine.categoryId)
          const dayLabels = routine.timeBlocks[0]?.recurringDays
            .map(d => DAYS[d].slice(0, 3))
            .join(', ')

          return (
            <div key={routine.id} className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <span>{category?.icon}</span>
                    <span>{routine.name}</span>
                  </h3>
                  <div className="text-sm text-slate-600 mb-3">{dayLabels}</div>
                  <div className="space-y-1">
                    {routine.timeBlocks.map((block, idx) => (
                      <div key={block.id} className="text-sm text-slate-600">
                        {block.startTime} - {block.endTime}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(routine.id)
                      setName(routine.name)
                      setCategoryId(routine.categoryId)
                      setTimeBlocks(routine.timeBlocks)
                    }}
                    className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="px-3 py-1 text-sm border-2 border-red-300 text-red-600 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {routines.length === 0 && !isAdding && (
          <div className="bg-slate-50 rounded-lg p-12 text-center border-2 border-slate-200">
            <p className="text-slate-600 mb-4">No routines yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Create your first routine
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
