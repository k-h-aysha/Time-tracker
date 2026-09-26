'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { Goal } from '@/lib/types'

export default function GoalsPage() {
  const { categories, goals, entries, addGoal, updateGoal, deleteGoal } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [type, setType] = useState<'minimum' | 'maximum'>('minimum')
  const [targetHours, setTargetHours] = useState(4)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !targetHours) return

    const category = categories.find(c => c.id === categoryId)
    const goal: Goal = {
      id: editingId || `goal_${Date.now()}`,
      name: name || `${category?.name} ${type === 'minimum' ? '≥' : '≤'} ${targetHours}h`,
      categoryId,
      type,
      targetHours,
      period,
      active: true,
      createdAt: new Date().toISOString(),
    }

    if (editingId) {
      updateGoal(editingId, goal)
    } else {
      addGoal(goal)
    }

    resetForm()
  }

  const resetForm = () => {
    setName('')
    setCategoryId(categories[0]?.id || '')
    setType('minimum')
    setTargetHours(4)
    setPeriod('weekly')
    setIsAdding(false)
    setEditingId(null)
  }

  const getGoalProgress = (goal: Goal) => {
    const today = new Date().toISOString().split('T')[0]
    const weekStart = new Date(today + 'T00:00:00')
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    const weekStartStr = weekStart.toISOString().split('T')[0]

    const goalEntries = entries.filter(
      e => e.categoryId === goal.categoryId && e.date >= weekStartStr && e.date <= today
    )
    const totalMinutes = goalEntries.reduce((sum, e) => sum + e.duration, 0)
    const hours = totalMinutes / 60

    const met = goal.type === 'minimum' ? hours >= goal.targetHours : hours <= goal.targetHours
    const percentage = Math.min(100, Math.round((hours / goal.targetHours) * 100))

    return { hours, met, percentage }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Goals</h1>
          <p className="text-slate-600">Convert observations into measurable targets</p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Set Goal
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200 space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'minimum' | 'maximum')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="minimum">At least (≥)</option>
                <option value="maximum">No more than (≤)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Hours</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={targetHours}
                onChange={e => setTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Period</label>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Exercise more"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {editingId ? 'Update' : 'Create'} Goal
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-12 text-center border-2 border-slate-200">
            <p className="text-slate-600 mb-4">No goals yet. Start by setting a goal!</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Set your first goal
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const category = categories.find(c => c.id === goal.categoryId)
            const progress = getGoalProgress(goal)

            return (
              <div
                key={goal.id}
                className={`rounded-lg p-6 border-2 ${
                  progress.met ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                      <span>{category?.icon}</span>
                      <span>{goal.name}</span>
                    </h3>
                    <p className="text-sm text-slate-600">
                      {goal.type === 'minimum' ? 'At least' : 'No more than'} {goal.targetHours}h {goal.period}
                    </p>
                  </div>

                  {progress.met && <div className="text-2xl">✓</div>}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-semibold">{progress.hours.toFixed(1)}h</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${progress.met ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(goal.id)
                      setName(goal.name)
                      setCategoryId(goal.categoryId)
                      setType(goal.type)
                      setTargetHours(goal.targetHours)
                      setPeriod(goal.period)
                    }}
                    className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => updateGoal(goal.id, { active: !goal.active })}
                    className={`px-3 py-1 text-sm border rounded transition ${
                      goal.active
                        ? 'border-slate-300 hover:bg-slate-100'
                        : 'border-slate-300 bg-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {goal.active ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="px-3 py-1 text-sm border-2 border-red-300 text-red-600 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
