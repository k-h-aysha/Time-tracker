import { Category } from '@/lib/types'

interface Props {
  category: Category
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  asDiv?: boolean
}

export function CategoryBadge({ category, selected, onClick, size = 'md', asDiv }: Props) {
  const sizeClass = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }[size]

  const className = `rounded-full font-medium transition whitespace-nowrap border-2 flex items-center gap-2 ${sizeClass} ${
    selected
      ? `bg-white border-slate-900 text-slate-900`
      : `bg-white border-slate-200 text-slate-700 hover:border-slate-300`
  } ${onClick && !asDiv ? 'cursor-pointer' : ''}`

  const style = selected
    ? {
        borderColor: category.color,
        color: category.color,
      }
    : {}

  if (asDiv) {
    return (
      <div className={className} style={style}>
        <span>{category.icon}</span>
        <span>{category.name}</span>
      </div>
    )
  }

  return (
    <button onClick={onClick} className={className} style={style}>
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </button>
  )
}
