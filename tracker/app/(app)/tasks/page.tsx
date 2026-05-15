'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task, TaskStatus, TaskPriority } from '@/lib/tracker/types'

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
}

const blank = {
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  due_date: '',
  category: '',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...blank })
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    setTasks((data as Task[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm({ ...blank })
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(task: Task) {
    setForm({
      title: task.title,
      description: task.description ?? '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ?? '',
      category: task.category ?? '',
    })
    setEditId(task.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      category: form.category || null,
    }
    if (editId) {
      await supabase.from('tasks').update(payload).eq('id', editId)
    } else {
      await supabase.from('tasks').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('tasks').delete().eq('id', id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  async function toggleStatus(task: Task) {
    const next: TaskStatus =
      task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done'
    const supabase = createClient()
    await supabase.from('tasks').update({ status: next }).eq('id', task.id)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)))
  }

  const filtered = filterStatus === 'all' ? tasks : tasks.filter((t) => t.status === filterStatus)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tasks</h2>
        <div className="flex gap-1">
          {(['all', 'todo', 'in-progress', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterStatus === s
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {s === 'all' ? 'All' : s === 'todo' ? 'To Do' : s === 'in-progress' ? 'In Progress' : 'Done'}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="ml-auto rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
        >
          + New task
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold">{editId ? 'Edit task' : 'New task'}</h3>
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Task title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Status</label>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Priority</label>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
                  {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Due date</label>
                <input type="date" className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Category</label>
                <input className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="e.g. Work" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">No tasks. Click &ldquo;+ New task&rdquo; to add one.</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((task) => {
            const isOverdue = task.due_date && task.due_date < today && task.status !== 'done'
            return (
              <li key={task.id} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                <button onClick={() => toggleStatus(task)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs transition ${task.status === 'done' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {task.status === 'done' && '✓'}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
                  {task.description && <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{task.description}</p>}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                    {task.category && <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">{task.category}</span>}
                    {task.due_date && <span className={`rounded-full px-2 py-0.5 text-xs ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>{isOverdue ? '⚠ ' : ''}Due {task.due_date}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(task)} className="rounded p-1 text-gray-400 hover:text-gray-600">✎</button>
                  <button onClick={() => handleDelete(task.id)} className="rounded p-1 text-gray-400 hover:text-red-500">✕</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
