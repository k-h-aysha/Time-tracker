'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-semibold text-lg">
          ⏱️ TimeTracker
        </Link>

        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className={`transition ${isActive('/') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Today
          </Link>
          <Link
            href="/week"
            className={`transition ${isActive('/week') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Week
          </Link>
          <Link
            href="/analytics"
            className={`transition ${isActive('/analytics') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Analytics
          </Link>
          <Link
            href="/calendar"
            className={`transition ${isActive('/calendar') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Calendar
          </Link>
          <Link
            href="/routines"
            className={`transition ${isActive('/routines') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Routines
          </Link>
          <Link
            href="/goals"
            className={`transition ${isActive('/goals') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Goals
          </Link>
          <Link
            href="/categories"
            className={`transition ${isActive('/categories') ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}
