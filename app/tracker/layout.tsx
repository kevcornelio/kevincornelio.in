'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const tabs = [
  { href: '/tracker', label: 'Dashboard', icon: '▦' },
  { href: '/tracker/tasks', label: 'Tasks', icon: '✓' },
  { href: '/tracker/finances', label: 'Finances', icon: '$' },
  { href: '/tracker/health', label: 'Health', icon: '♥' },
  { href: '/tracker/goals', label: 'Goals', icon: '◎' },
  { href: '/tracker/vaccinations', label: 'Vaccinations', icon: '💉' },
]

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/tracker/login')
    router.refresh()
  }

  if (pathname === '/tracker/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-[70vh]">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Personal Tracker</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
        >
          Sign out
        </button>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.href === '/tracker' ? pathname === '/tracker' : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}
