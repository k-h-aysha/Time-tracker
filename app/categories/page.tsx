'use client'

import { useState } from 'react'
import { useApp } from '@/app/context'
import { Category } from '@/lib/types'

const ICONS = ['😴', '💼', '📚', '📱', '🏃', '🍽️', '👯', '👨‍👩‍👧', '🎮', '🧘', '✈️', '💕', '🪒', '🔧', '📌']
const COLORS = [
  '#6B8DD6',
  '#D4A574',
  '#8B7AA6',
  '#333333',
  '#F4B942',
  '#E89B6C',
  '#D84C8D',
  '#1F3A93',
  '#5FD4D4',
  '#A8D4A0',
  '#9B8FBE',
  '#E87B6B',
  '#C9A0DC',
  '#CCCCCC',
]

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [color, setColor] = useState(COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    if (editingId) {
      updateCategory(editingId, { name, icon, color })
      setEditingId(null)
    } else {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name,
        icon,
        color,
        active: true,
        order: categories.length,
      }
      addCategory(newCategory)
    }

    setName('')
    setIcon(ICONS[0])
    setColor(COLORS[0])
    setIsAdding(false)
  }

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setIcon(cat.icon)
    setColor(cat.color)
  }

  const handleCancel = () => {
    setEditingId(null)
    setName('')
    setIcon(ICONS[0])
    setColor(COLORS[0])
    setIsAdding(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Categories</h1>
          <p className="text-slate-600">Customize your time tracking categories</p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add Category
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Work"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Color</label>
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition border-2 ${
                    color === c ? 'border-slate-900 scale-110' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {editingId ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-lg p-2 border-2 border-slate-200 hover:border-slate-300 transition"
          >
            <h3 className="font-semibold mb-2 text-sm">{cat.name}</h3>

            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-slate-600">{cat.color}</span>
            </div>

            <div className="flex gap-1 text-xs">
              <button
                onClick={() => handleEdit(cat)}
                className="flex-1 px-2 py-1 border border-slate-300 rounded hover:bg-white transition text-xs"
              >
                Edit
              </button>
              {categories.length > 1 && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="flex-1 px-2 py-1 border-2 border-red-300 text-red-600 rounded hover:bg-red-50 transition text-xs"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="font-semibold mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>Start with 5-10 main categories to keep tracking simple</li>
          <li>Use consistent icons and colors to quickly identify categories</li>
          <li>You can mark categories as inactive instead of deleting them</li>
          <li>Default categories will always be available</li>
        </ul>
      </div>
    </div>
  )
}
