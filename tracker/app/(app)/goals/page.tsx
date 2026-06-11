'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Goal, GoalStatus, Milestone } from '@/lib/tracker/types'

const statusColors: Record<GoalStatus, string> = {
  active: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

const blank = { title: '', description: '', category: '', target_date: '', progress: 0, status: 'active' as GoalStatus, milestones: [] as Milestone[] }

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...blank })
  const [newMilestone, setNewMilestone] = useState('')
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all')
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false })
    setGoals((data as Goal[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setForm({ ...blank }); setNewMilestone(''); setEditId(null); setShowForm(true) }
  function openEdit(g: Goal) {
    setForm({ title: g.title, description: g.description ?? '', category: g.category ?? '', target_date: g.target_date ?? '', progress: g.progress, status: g.status, milestones: g.milestones ?? [] })
    setNewMilestone(''); setEditId(g.id); setShowForm(true)
  }

  function addMilestone() {
    if (!newMilestone.trim()) return
    setForm({ ...form, milestones: [...form.milestones, { id: crypto.randomUUID(), title: newMilestone.trim(), completed: false }] })
    setNewMilestone('')
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    const supabase = createClient()
    const payload = { title: form.title.trim(), description: form.description || null, category: form.category || null, target_date: form.target_date || null, progress: form.progress, status: form.status, milestones: form.milestones }
    if (editId) { await supabase.from('goals').update(payload).eq('id', editId) }
    else { await supabase.from('goals').insert(payload) }
    setSaving(false); setShowForm(false); load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('goals').delete().eq('id', id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  async function updateProgress(goal: Goal, progress: number) {
    const supabase = createClient()
    const status: GoalStatus = progress >= 100 ? 'completed' : goal.status === 'completed' ? 'active' : goal.status
    await supabase.from('goals').update({ progress, status }).eq('id', goal.id)
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? { ...g, progress, status } : g)))
  }

  const filtered = filterStatus === 'all' ? goals : goals.filter((g) => g.status === filterStatus)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Goals</h2>
        <div className="flex gap-1">
          {(['all', 'active', 'completed', 'paused'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${filterStatus === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}>{s}</button>
          ))}
        </div>
        <button onClick={openNew} className="ml-auto rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600">+ New goal</button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold">{editId ? 'Edit goal' : 'New goal'}</h3>
          <div className="space-y-3">
            <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none" placeholder="Goal title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none" placeholder="Description (optional)" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div><label className="mb-1 block text-xs text-gray-500">Category</label><input className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="e.g. Career" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs text-gray-500">Target date</label><input type="date" className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} /></div>
              <div><label className="mb-1 block text-xs text-gray-500">Progress ({form.progress}%)</label><input type="range" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: parseInt(e.target.value) })} className="mt-2 w-full accent-primary-500" /></div>
              <div><label className="mb-1 block text-xs text-gray-500">Status</label><select className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GoalStatus })}><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select></div>
            </div>
            <div>
              <label className="mb-2 block text-xs text-gray-500">Milestones</label>
              {form.milestones.length > 0 && (
                <ul className="mb-2 space-y-1">
                  {form.milestones.map((m) => (
                    <li key={m.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={m.completed} onChange={() => setForm({ ...form, milestones: form.milestones.map((x) => x.id === m.id ? { ...x, completed: !x.completed } : x) })} className="accent-primary-500" />
                      <span className={`flex-1 text-sm ${m.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{m.title}</span>
                      <button onClick={() => setForm({ ...form, milestones: form.milestones.filter((x) => x.id !== m.id) })} className="text-xs text-gray-400 hover:text-red-500">✕</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none" placeholder="Add a milestone…" value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMilestone()} />
                <button onClick={addMilestone} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400">Add</button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-400">No goals. Click &ldquo;+ New goal&rdquo; to get started.</div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((goal) => {
            const completedMs = goal.milestones?.filter((m) => m.completed).length ?? 0
            const totalMs = goal.milestones?.length ?? 0
            return (
              <li key={goal.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[goal.status]}`}>{goal.status}</span>
                      {goal.category && <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">{goal.category}</span>}
                    </div>
                    {goal.description && <p className="mt-0.5 text-xs text-gray-500">{goal.description}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button onClick={() => openEdit(goal)} className="rounded p-1 text-gray-400 hover:text-gray-600">✎</button>
                    <button onClick={() => handleDelete(goal.id)} className="rounded p-1 text-gray-400 hover:text-red-500">✕</button>
                  </div>
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${goal.progress}%` }} />
                </div>
                <input type="range" min={0} max={100} value={goal.progress} onChange={(e) => updateProgress(goal, parseInt(e.target.value))} className="mt-1 w-full accent-primary-500" />
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  {goal.target_date && <span>Target: {goal.target_date}</span>}
                  {totalMs > 0 && <span>Milestones: {completedMs}/{totalMs}</span>}
                </div>
                {goal.milestones && goal.milestones.length > 0 && (
                  <ul className="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-700">
                    {goal.milestones.map((m) => (
                      <li key={m.id} className="flex items-center gap-2">
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full border text-xs ${m.completed ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 dark:border-gray-600'}`}>{m.completed && '✓'}</span>
                        <span className={`text-xs ${m.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>{m.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
