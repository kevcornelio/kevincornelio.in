'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Task, Finance, Goal, HealthLog } from '@/lib/tracker/types'

interface Summary {
  tasks: { total: number; done: number; overdue: number }
  finances: { income: number; expenses: number; net: number }
  health: { logsThisWeek: number }
  goals: { total: number; active: number; avgProgress: number }
}

export default function TrackerDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0]

      const [tasksRes, financesRes, healthRes, goalsRes] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('finances').select('*').gte('date', monthStart),
        supabase.from('health_logs').select('*').gte('date', weekAgo),
        supabase.from('goals').select('*'),
      ])

      const tasks = (tasksRes.data as Task[]) ?? []
      const finances = (financesRes.data as Finance[]) ?? []
      const healthLogs = (healthRes.data as HealthLog[]) ?? []
      const goals = (goalsRes.data as Goal[]) ?? []

      const income = finances.filter((f) => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0)
      const expenses = finances.filter((f) => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0)
      const activeGoals = goals.filter((g) => g.status === 'active')
      const avgProgress = activeGoals.length
        ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length)
        : 0

      setSummary({
        tasks: {
          total: tasks.length,
          done: tasks.filter((t) => t.status === 'done').length,
          overdue: tasks.filter((t) => t.due_date && t.due_date < today && t.status !== 'done').length,
        },
        finances: { income, expenses, net: income - expenses },
        health: { logsThisWeek: healthLogs.length },
        goals: { total: goals.length, active: activeGoals.length, avgProgress },
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    )
  }

  const s = summary!
  const month = new Date().toLocaleString('default', { month: 'long' })

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          href="/tracker/tasks"
          title="Tasks"
          icon="✓"
          color="cyan"
          stats={[
            { label: 'Total', value: s.tasks.total },
            { label: 'Done', value: s.tasks.done },
            { label: 'Overdue', value: s.tasks.overdue, warn: s.tasks.overdue > 0 },
          ]}
        />
        <SummaryCard
          href="/tracker/finances"
          title={`Finances (${month})`}
          icon="$"
          color="green"
          stats={[
            { label: 'Income', value: `$${s.finances.income.toLocaleString()}` },
            { label: 'Expenses', value: `$${s.finances.expenses.toLocaleString()}` },
            { label: 'Net', value: `$${s.finances.net.toLocaleString()}`, warn: s.finances.net < 0 },
          ]}
        />
        <SummaryCard
          href="/tracker/health"
          title="Health"
          icon="♥"
          color="rose"
          stats={[
            { label: 'Logs this week', value: s.health.logsThisWeek },
          ]}
        />
        <SummaryCard
          href="/tracker/goals"
          title="Goals"
          icon="◎"
          color="violet"
          stats={[
            { label: 'Active', value: s.goals.active },
            { label: 'Total', value: s.goals.total },
            { label: 'Avg progress', value: `${s.goals.avgProgress}%` },
          ]}
        />
      </div>
    </div>
  )
}

function SummaryCard({
  href,
  title,
  icon,
  color,
  stats,
}: {
  href: string
  title: string
  icon: string
  color: 'cyan' | 'green' | 'rose' | 'violet'
  stats: { label: string; value: string | number; warn?: boolean }[]
}) {
  const borderColors = {
    cyan: 'border-primary-400',
    green: 'border-green-400',
    rose: 'border-rose-400',
    violet: 'border-violet-400',
  }

  return (
    <Link
      href={href}
      className={`block rounded-xl border-l-4 ${borderColors[color]} bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      </div>
      <div className="space-y-1">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
            <span
              className={`text-sm font-medium ${
                stat.warn ? 'text-red-500' : 'text-gray-900 dark:text-white'
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </Link>
  )
}
