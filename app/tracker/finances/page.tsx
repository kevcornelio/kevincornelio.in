'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Finance, FinanceType } from '@/lib/tracker/types'

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Utilities', 'Other']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']

const blank = {
  type: 'expense' as FinanceType,
  amount: '',
  category: 'Food',
  description: '',
  date: new Date().toISOString().split('T')[0],
}

export default function FinancesPage() {
  const [records, setRecords] = useState<Finance[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...blank })
  const [filterType, setFilterType] = useState<FinanceType | 'all'>('all')
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const start = `${filterMonth}-01`
    const end = new Date(
      parseInt(filterMonth.split('-')[0]),
      parseInt(filterMonth.split('-')[1]),
      0
    ).toISOString().split('T')[0]

    const { data } = await supabase
      .from('finances')
      .select('*')
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false })
    setRecords((data as Finance[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filterMonth])

  function openNew() {
    setForm({ ...blank })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(r: Finance) {
    setForm({
      type: r.type,
      amount: String(r.amount),
      category: r.category,
      description: r.description ?? '',
      date: r.date,
    })
    setEditId(r.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.amount || isNaN(parseFloat(form.amount))) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description || null,
      date: form.date,
    }

    if (editId) {
      await supabase.from('finances').update(payload).eq('id', editId)
    } else {
      await supabase.from('finances').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('finances').delete().eq('id', id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const filtered = filterType === 'all' ? records : records.filter((r) => r.type === filterType)
  const income = records.filter((r) => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0)
  const expenses = records.filter((r) => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0)
  const net = income - expenses

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Finances</h2>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="ml-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
        />
        <button
          onClick={openNew}
          className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600 dark:bg-primary-400 dark:text-gray-900"
        >
          + Add entry
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: 'Income', value: income, color: 'text-green-600 dark:text-green-400' },
          { label: 'Expenses', value: expenses, color: 'text-red-500' },
          { label: 'Net', value: net, color: net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`mt-0.5 text-lg font-bold ${stat.color}`}>
              {net < 0 && stat.label === 'Net' ? '-' : ''}${Math.abs(stat.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {editId ? 'Edit entry' : 'New entry'}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {(['expense', 'income'] as FinanceType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t, category: t === 'income' ? 'Salary' : 'Food' })}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {t === 'income' ? 'Income' : 'Expense'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Amount *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Date *</label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Category</label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Description</label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Optional note"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                disabled={saving || !form.amount}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 dark:bg-primary-400 dark:text-gray-900"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3 flex gap-1">
        {(['all', 'income', 'expense'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filterType === t
                ? 'bg-primary-500 text-white dark:bg-primary-400 dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expenses'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
          No entries. Click &ldquo;+ Add entry&rdquo; to start.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  r.type === 'income'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
                    : 'bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-400'
                }`}
              >
                {r.type === 'income' ? '+' : '-'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{r.category}</span>
                  {r.description && (
                    <span className="truncate text-xs text-gray-400">{r.description}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
              <span
                className={`shrink-0 text-sm font-semibold ${
                  r.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                }`}
              >
                {r.type === 'income' ? '+' : '-'}${Number(r.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => openEdit(r)}
                  className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded p-1 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
