'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  VISIT_GROUPS,
  VACCINE_SCHEDULE,
  getAgeDays,
  formatAge,
  getScheduleStatus,
  type Child,
  type VaccineRecord,
  type VaccineScheduleEntry,
} from '@/lib/tracker/vaccinations'

const statusConfig = {
  given:    { label: 'Given',         classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',     dot: 'bg-green-500' },
  due:      { label: 'Due now',       classes: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400', dot: 'bg-primary-500' },
  overdue:  { label: 'Overdue',       classes: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',             dot: 'bg-red-500' },
  missed:   { label: 'Missed window', classes: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500',            dot: 'bg-gray-400' },
  upcoming: { label: 'Upcoming',      classes: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',            dot: 'bg-gray-300 dark:bg-gray-600' },
}

export default function VaccinationsPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [records, setRecords] = useState<VaccineRecord[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [showChildForm, setShowChildForm] = useState(false)
  const [childForm, setChildForm] = useState({ name: '', dob: '' })
  const [savingChild, setSavingChild] = useState(false)

  const [recordEntry, setRecordEntry] = useState<VaccineScheduleEntry | null>(null)
  const [recordForm, setRecordForm] = useState({ date_given: '', provider: '', lot_number: '', notes: '' })
  const [savingRecord, setSavingRecord] = useState(false)

  const [showAll, setShowAll] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data: kids } = await supabase.from('children').select('*').order('created_at')
    const kidList = (kids as Child[]) ?? []
    setChildren(kidList)
    if (kidList.length > 0) {
      const activeId = selectedChildId ?? kidList[0].id
      setSelectedChildId(activeId)
      const { data: recs } = await supabase.from('vaccine_records').select('*').eq('child_id', activeId)
      setRecords((recs as VaccineRecord[]) ?? [])
    }
    setLoading(false)
  }

  async function loadRecords(childId: string) {
    const supabase = createClient()
    const { data: recs } = await supabase.from('vaccine_records').select('*').eq('child_id', childId)
    setRecords((recs as VaccineRecord[]) ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleSelectChild(id: string) {
    setSelectedChildId(id)
    setRecords([])
    await loadRecords(id)
  }

  async function handleSaveChild() {
    if (!childForm.name.trim() || !childForm.dob) return
    setSavingChild(true)
    const supabase = createClient()
    const { data } = await supabase.from('children').insert({ name: childForm.name.trim(), dob: childForm.dob }).select().single()
    if (data) {
      setChildren((prev) => [...prev, data as Child])
      setSelectedChildId((data as Child).id)
      await loadRecords((data as Child).id)
    }
    setChildForm({ name: '', dob: '' })
    setSavingChild(false)
    setShowChildForm(false)
  }

  async function handleDeleteChild(id: string) {
    const supabase = createClient()
    await supabase.from('children').delete().eq('id', id)
    setChildren((prev) => prev.filter((c) => c.id !== id))
    if (selectedChildId === id) {
      const remaining = children.filter((c) => c.id !== id)
      setSelectedChildId(remaining[0]?.id ?? null)
      if (remaining[0]) await loadRecords(remaining[0].id)
      else setRecords([])
    }
  }

  function openRecordForm(entry: VaccineScheduleEntry) {
    setRecordEntry(entry)
    setRecordForm({ date_given: new Date().toISOString().split('T')[0], provider: '', lot_number: '', notes: '' })
  }

  async function handleSaveRecord() {
    if (!recordEntry || !selectedChildId || !recordForm.date_given) return
    setSavingRecord(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('vaccine_records')
      .insert({ child_id: selectedChildId, vaccine_key: recordEntry.key, date_given: recordForm.date_given, provider: recordForm.provider || null, lot_number: recordForm.lot_number || null, notes: recordForm.notes || null })
      .select().single()
    if (data) setRecords((prev) => [...prev, data as VaccineRecord])
    setSavingRecord(false)
    setRecordEntry(null)
  }

  async function handleDeleteRecord(vaccineKey: string) {
    if (!selectedChildId) return
    const supabase = createClient()
    await supabase.from('vaccine_records').delete().eq('child_id', selectedChildId).eq('vaccine_key', vaccineKey)
    setRecords((prev) => prev.filter((r) => r.vaccine_key !== vaccineKey))
  }

  const child = children.find((c) => c.id === selectedChildId)
  const ageDays = child ? getAgeDays(child.dob) : 0
  const recordMap = new Map(records.map((r) => [r.vaccine_key, r]))

  const actionNeeded = VACCINE_SCHEDULE.filter((e) => {
    const s = getScheduleStatus(e, ageDays, recordMap.get(e.key))
    return s === 'overdue' || s === 'due'
  })

  const givenCount = VACCINE_SCHEDULE.filter((e) => recordMap.has(e.key)).length
  const totalCount = VACCINE_SCHEDULE.length
  const relevantGroups = VISIT_GROUPS.filter((g) => showAll ? true : g.ageDays <= ageDays + 180)

  if (loading) return <div className="flex h-40 items-center justify-center text-sm text-gray-400">Loading…</div>

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccinations</h2>
          <p className="text-xs text-gray-400">Indian Academy of Pediatrics (IAP) schedule</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {children.map((c) => (
            <button key={c.id} onClick={() => handleSelectChild(c.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedChildId === c.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}>
              {c.name}
            </button>
          ))}
          <button onClick={() => setShowChildForm(true)}
            className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 hover:border-primary-400 hover:text-primary-500 dark:border-gray-600 transition">
            + Add child
          </button>
        </div>
      </div>

      {showChildForm && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Add child</h3>
          <div className="flex flex-wrap gap-3">
            <input className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none"
              placeholder="Child's name" value={childForm.name} onChange={(e) => setChildForm({ ...childForm, name: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Date of birth</label>
              <input type="date" className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                value={childForm.dob} onChange={(e) => setChildForm({ ...childForm, dob: e.target.value })} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => setShowChildForm(false)} className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSaveChild} disabled={savingChild || !childForm.name || !childForm.dob}
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {savingChild ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!child && !showChildForm && (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-gray-700">
          <p className="text-sm">No child profile yet</p>
          <button onClick={() => setShowChildForm(true)} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white">Add child</button>
        </div>
      )}

      {child && (
        <>
          {/* Child info bar */}
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{child.name}</p>
              <p className="text-xs text-gray-400">
                Born {new Date(child.dob + 'T12:00:00').toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}{formatAge(ageDays)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-primary-500">{givenCount}</p>
                <p className="text-xs text-gray-400">of {totalCount} given</p>
              </div>
              <div className="hidden w-32 sm:block">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${Math.round((givenCount / totalCount) * 100)}%` }} />
                </div>
                <p className="mt-0.5 text-right text-xs text-gray-400">{Math.round((givenCount / totalCount) * 100)}%</p>
              </div>
              <button onClick={() => handleDeleteChild(child.id)} className="text-xs text-gray-400 hover:text-red-500 transition">Remove</button>
            </div>
          </div>

          {/* Action needed alert */}
          {actionNeeded.length > 0 && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-900/20">
              <p className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
                ⚠ Action needed ({actionNeeded.length} vaccine{actionNeeded.length > 1 ? 's' : ''})
              </p>
              <div className="flex flex-wrap gap-2">
                {actionNeeded.map((e) => {
                  const status = getScheduleStatus(e, ageDays, recordMap.get(e.key))
                  return (
                    <span key={e.key} className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig[status].classes}`}>
                      {e.vaccine} — {statusConfig[status].label}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Record vaccine modal */}
          {recordEntry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-900">
                <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Record vaccination</h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{recordEntry.vaccine} — {recordEntry.description}</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Date given *</label>
                    <input type="date" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none"
                      value={recordForm.date_given} onChange={(e) => setRecordForm({ ...recordForm, date_given: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Provider / clinic</label>
                    <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none"
                      placeholder="e.g. Dr. Smith, City Clinic" value={recordForm.provider} onChange={(e) => setRecordForm({ ...recordForm, provider: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Lot / batch number</label>
                    <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none"
                      placeholder="From vaccine vial" value={recordForm.lot_number} onChange={(e) => setRecordForm({ ...recordForm, lot_number: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Notes</label>
                    <textarea className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Brand name, reactions, batch number…" rows={2}
                      value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setRecordEntry(null)} className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
                  <button onClick={handleSaveRecord} disabled={savingRecord || !recordForm.date_given}
                    className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {savingRecord ? 'Saving…' : 'Save record'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">IAP Vaccination Schedule</h3>
            <button onClick={() => setShowAll(!showAll)} className="text-xs text-primary-500 hover:underline">
              {showAll ? 'Show relevant only' : 'Show full schedule'}
            </button>
          </div>

          <div className="space-y-4">
            {relevantGroups.map((group) => {
              if (group.vaccines.length === 0) return null
              const groupStatuses = group.vaccines.map((e) => getScheduleStatus(e, ageDays, recordMap.get(e.key)))
              const allGiven = groupStatuses.every((s) => s === 'given')
              const hasAction = groupStatuses.some((s) => s === 'due' || s === 'overdue')
              return (
                <div key={group.label}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${allGiven ? 'bg-green-500' : hasAction ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">{group.label}</h4>
                    {allGiven && <span className="text-xs text-green-600 dark:text-green-400">✓ Complete</span>}
                  </div>
                  <div className="ml-4 space-y-1.5">
                    {group.vaccines.map((entry) => {
                      const record = recordMap.get(entry.key)
                      const status = getScheduleStatus(entry, ageDays, record)
                      const cfg = statusConfig[status]
                      return (
                        <div key={entry.key} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 dark:border-gray-700/50 dark:bg-gray-900">
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm text-gray-800 dark:text-gray-200">{entry.vaccine}</span>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.classes}`}>{cfg.label}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">{entry.description}</p>
                            {record && (
                              <p className="mt-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                Given {new Date(record.date_given + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                {record.provider && ` · ${record.provider}`}
                                {record.lot_number && ` · Lot: ${record.lot_number}`}
                                {record.notes && ` · ${record.notes}`}
                              </p>
                            )}
                          </div>
                          {status === 'given' ? (
                            <button onClick={() => handleDeleteRecord(entry.key)}
                              className="shrink-0 text-xs text-gray-300 hover:text-red-400 transition" title="Undo">✕</button>
                          ) : (
                            <button onClick={() => openRecordForm(entry)}
                              className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                                status === 'due' || status === 'overdue'
                                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                              }`}>
                              Record
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
