'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { HealthLog } from '@/lib/tracker/types'

const LOG_TYPES = [
  { value: 'workout', label: 'Workout', unit: 'min', placeholder: 'Duration' },
  { value: 'weight', label: 'Weight', unit: 'kg', placeholder: 'Weight' },
  { value: 'sleep', label: 'Sleep', unit: 'hrs', placeholder: 'Hours' },
  { value: 'water', label: 'Water', unit: 'L', placeholder: 'Liters' },
  { value: 'steps', label: 'Steps', unit: 'steps', placeholder: 'Count' },
  { value: 'mood', label: 'Mood', unit: '/10', placeholder: '1–10' },
  { value: 'custom', label: 'Custom', unit: '', placeholder: 'Value' },
]

const typeColors: Record<string, string> = {
  workout: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
  weight: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  sleep: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
  water: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400',
  steps: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  mood: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
  custom: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const blank = {
  type: 'workout',
  value: '',
  unit: 'min',
  notes: '',
  date: new Date().toISOString().split('T')[0],
}

export default function HealthPage() {
  const [logs, setLogs] = useState<HealthLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...blank })
  const [filterDays, setFilterDays] = useState(7)
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const since = new Date(Date.now() - filterDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const { data } = await supabase
      .from('health_logs')
      .select('*')
      .gte('date', since)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    setLogs((data as HealthLog[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filterDays])

  function openNew() {
    setForm({ ...blank })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(log: HealthLog) {
    setForm({
      type: log.type,
      value: log.value != null ? String(log.value) : '',
      unit: log.unit ?? '',
      notes: log.notes ?? '',
      date: log.date,
    })
    setEditId(log.id)
    setShowForm(true)
  }

  function handleTypeChange(type: string) {
    const preset = LOG_TYPES.find((t) => t.value === type)
    setForm({ ...form, type, unit: preset?.unit ?? '' })
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      type: form.type,
      value: form.value !== '' ? parseFloat(form.value) : null,
      unit: form.unit || null,
      notes: form.notes || null,
      date: form.date,
    }

    if (editId) {
      await supabase.from('health_logs').update(payload).eq('id', editId)
    } else {
      await supabase.from('health_logs').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('health_logs').delete().eq('id', id)
    setLogs((prev) => prev.filter((l) => l.id !== id))
  }

  const groupedByDate = logs.reduce<Record<string, HealthLog[]>>((acc, log) => {
    acc[log.date] = acc[log.date] ?? []
    acc[log.date].push(log)
    return acc
  }, {})

  const preset = LOG_TYPES.find((t) => t.value === form.type)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Health</h2>
        <div className="ml-auto flex gap-1">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDays(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterDays === d
                  ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600 dark:bg-primary-400 dark:text-gray-900"
        >
          + Log entry
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {editId ? 'Edit log' : 'New log'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {LOG_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleTypeChange(t.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      form.type === t.value
                        ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  {preset?.placeholder ?? 'Value'}
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder={preset?.placeholder ?? 'Value'}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Unit</label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Date</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Notes</label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Optional notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 dark:bg-primary-400 dark:text-gray-900"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          No logs. Click &ldquo;+ Log entry&rdquo; to start tracking.
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, dayLogs]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <ul className="space-y-2">
                {dayLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        typeColors[log.type] ?? typeColors.custom
                      }`}
                    >
                      {log.type}
                    </span>
                    {log.value != null && (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {log.value} {log.unit}
                      </span>
                    )}
                    {log.notes && (
                      <span className="flex-1 truncate text-xs text-gray-400">{log.notes}</span>
                    )}
                    <div className="ml-auto flex shrink-0 gap-1">
                      <button
                        onClick={() => openEdit(log)}
                        className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="rounded p-1 text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
