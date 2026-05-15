'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: '✓' },
  { href: '/finances', label: 'Finances', icon: '$' },
  { href: '/health', label: 'Health', icon: '♥' },
  { href: '/goals', label: 'Goals', icon: '◎' },
  { href: '/vaccinations', label: 'Vaccinations', icon: '💉' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navContent = (
    <>
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Tracker</h1>
        <p className="text-xs text-gray-400">Personal dashboard</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={handleSignOut}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-900 dark:hover:text-gray-200 transition"
      >
        <span className="text-xs">→</span>
        Sign out
      </button>
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-950 md:flex">
        {navContent}
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950 md:hidden">
        <span className="font-bold text-gray-900 dark:text-white">Tracker</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 pt-14 md:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-56 flex-col border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-950">
            {navContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 pt-6 md:pt-6 max-md:pt-20">
        {children}
      </main>
    </div>
  )
}
