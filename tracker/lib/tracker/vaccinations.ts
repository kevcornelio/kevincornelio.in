export interface VaccineScheduleEntry {
  key: string
  vaccine: string
  description: string
  ageLabel: string
  minAgeDays: number
  maxAgeDays: number
  series: number
}

export const VACCINE_SCHEDULE: VaccineScheduleEntry[] = [
  // Birth
  { key: 'bcg',       vaccine: 'BCG',                    description: 'Bacillus Calmette–Guérin · Tuberculosis',              ageLabel: 'Birth',       minAgeDays: 0,    maxAgeDays: 3,     series: 1 },
  { key: 'opv0',      vaccine: 'OPV 0',                  description: 'Oral Polio Vaccine · 0th dose',                        ageLabel: 'Birth',       minAgeDays: 0,    maxAgeDays: 3,     series: 1 },
  { key: 'hepb1',     vaccine: 'Hepatitis B',            description: '1st dose',                                             ageLabel: 'Birth',       minAgeDays: 0,    maxAgeDays: 3,     series: 3 },
  // 6 Weeks
  { key: 'dtap1',     vaccine: 'DTwP / DTaP',            description: '1st dose · Diphtheria, Tetanus, Pertussis',            ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 5 },
  { key: 'ipv1',      vaccine: 'IPV',                    description: '1st dose · Inactivated Polio Vaccine',                 ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 4 },
  { key: 'hepb2',     vaccine: 'Hepatitis B',            description: '2nd dose',                                             ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 3 },
  { key: 'hib1',      vaccine: 'Hib',                    description: '1st dose · Haemophilus influenzae type b',             ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 4 },
  { key: 'rv1',       vaccine: 'Rotavirus',              description: '1st dose',                                             ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 3 },
  { key: 'pcv1',      vaccine: 'PCV',                    description: '1st dose · Pneumococcal',                              ageLabel: '6 Weeks',     minAgeDays: 42,   maxAgeDays: 69,    series: 4 },
  // 10 Weeks
  { key: 'dtap2',     vaccine: 'DTwP / DTaP',            description: '2nd dose',                                             ageLabel: '10 Weeks',    minAgeDays: 70,   maxAgeDays: 97,    series: 5 },
  { key: 'ipv2',      vaccine: 'IPV',                    description: '2nd dose',                                             ageLabel: '10 Weeks',    minAgeDays: 70,   maxAgeDays: 97,    series: 4 },
  { key: 'hib2',      vaccine: 'Hib',                    description: '2nd dose',                                             ageLabel: '10 Weeks',    minAgeDays: 70,   maxAgeDays: 97,    series: 4 },
  { key: 'rv2',       vaccine: 'Rotavirus',              description: '2nd dose',                                             ageLabel: '10 Weeks',    minAgeDays: 70,   maxAgeDays: 97,    series: 3 },
  { key: 'pcv2',      vaccine: 'PCV',                    description: '2nd dose',                                             ageLabel: '10 Weeks',    minAgeDays: 70,   maxAgeDays: 97,    series: 4 },
  // 14 Weeks
  { key: 'dtap3',     vaccine: 'DTwP / DTaP',            description: '3rd dose',                                             ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 5 },
  { key: 'ipv3',      vaccine: 'IPV',                    description: '3rd dose',                                             ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 4 },
  { key: 'hib3',      vaccine: 'Hib',                    description: '3rd dose',                                             ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 4 },
  { key: 'opv1',      vaccine: 'OPV 1',                  description: 'Oral Polio Vaccine · 1st dose',                        ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 2 },
  { key: 'rv3',       vaccine: 'Rotavirus',              description: '3rd dose',                                             ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 3 },
  { key: 'pcv3',      vaccine: 'PCV',                    description: '3rd dose',                                             ageLabel: '14 Weeks',    minAgeDays: 98,   maxAgeDays: 125,   series: 4 },
  // 6 Months
  { key: 'hepb3',     vaccine: 'Hepatitis B',            description: '3rd dose',                                             ageLabel: '6 Months',    minAgeDays: 168,  maxAgeDays: 210,   series: 3 },
  { key: 'flu1',      vaccine: 'Influenza',              description: '1st dose (2 doses 4 weeks apart if first time)',       ageLabel: '6 Months',    minAgeDays: 168,  maxAgeDays: 210,   series: 1 },
  // 9 Months
  { key: 'mmr1',      vaccine: 'MMR',                    description: '1st dose · Measles, Mumps, Rubella',                  ageLabel: '9 Months',    minAgeDays: 270,  maxAgeDays: 300,   series: 2 },
  { key: 'hepa1',     vaccine: 'Hepatitis A',            description: '1st dose',                                             ageLabel: '9 Months',    minAgeDays: 270,  maxAgeDays: 300,   series: 2 },
  // 12 Months
  { key: 'typhoid1',  vaccine: 'Typhoid Conjugate (TCV)',description: '1st dose',                                             ageLabel: '12 Months',   minAgeDays: 365,  maxAgeDays: 395,   series: 1 },
  // 15 Months
  { key: 'mmr2',      vaccine: 'MMR',                    description: '2nd dose (booster)',                                   ageLabel: '15 Months',   minAgeDays: 456,  maxAgeDays: 490,   series: 2 },
  { key: 'var1',      vaccine: 'Varicella',              description: '1st dose · Chickenpox',                                ageLabel: '15 Months',   minAgeDays: 456,  maxAgeDays: 490,   series: 2 },
  { key: 'pcvb',      vaccine: 'PCV Booster',            description: 'Booster dose',                                         ageLabel: '15 Months',   minAgeDays: 456,  maxAgeDays: 490,   series: 1 },
  // 18 Months
  { key: 'dtapb1',    vaccine: 'DTwP/DTaP Booster 1',   description: '1st booster dose',                                     ageLabel: '18 Months',   minAgeDays: 548,  maxAgeDays: 580,   series: 1 },
  { key: 'ipvb1',     vaccine: 'IPV Booster 1',          description: '1st booster dose',                                     ageLabel: '18 Months',   minAgeDays: 548,  maxAgeDays: 580,   series: 1 },
  { key: 'hibb1',     vaccine: 'Hib Booster',            description: 'Booster dose',                                         ageLabel: '18 Months',   minAgeDays: 548,  maxAgeDays: 580,   series: 1 },
  { key: 'hepa2',     vaccine: 'Hepatitis A',            description: '2nd dose (≥6 months after 1st)',                       ageLabel: '18 Months',   minAgeDays: 548,  maxAgeDays: 580,   series: 2 },
  // 2 Years
  { key: 'typhoidb',  vaccine: 'Typhoid Booster',        description: 'Booster · every 3 years',                             ageLabel: '2 Years',     minAgeDays: 730,  maxAgeDays: 760,   series: 1 },
  // Annual
  { key: 'flu-ann',   vaccine: 'Influenza (Annual)',     description: 'Annual booster — repeat every year',                  ageLabel: 'Annual',      minAgeDays: 548,  maxAgeDays: 99999, series: 1 },
  // 4–6 Years
  { key: 'dtapb2',    vaccine: 'DTwP/DTaP Booster 2',   description: '2nd booster dose',                                     ageLabel: '4–6 Years',   minAgeDays: 1461, maxAgeDays: 2190,  series: 1 },
  { key: 'opvb',      vaccine: 'OPV Booster',            description: 'Oral Polio Vaccine booster',                          ageLabel: '4–6 Years',   minAgeDays: 1461, maxAgeDays: 2190,  series: 1 },
  { key: 'var2',      vaccine: 'Varicella',              description: '2nd dose (booster)',                                   ageLabel: '4–6 Years',   minAgeDays: 1461, maxAgeDays: 2190,  series: 2 },
  { key: 'typhoidb2', vaccine: 'Typhoid Booster',        description: 'Repeat every 3 years',                                ageLabel: '4–6 Years',   minAgeDays: 1461, maxAgeDays: 2190,  series: 1 },
  // 10–12 Years
  { key: 'tdap',      vaccine: 'Tdap / Td',              description: 'Tetanus, Diphtheria, Pertussis booster',              ageLabel: '10–12 Years', minAgeDays: 3652, maxAgeDays: 4383,  series: 1 },
  { key: 'hpv',       vaccine: 'HPV',                    description: 'Human Papillomavirus · 2–3 doses',                    ageLabel: '10–12 Years', minAgeDays: 3652, maxAgeDays: 4383,  series: 1 },
]

export interface VisitGroup {
  label: string
  ageDays: number
  vaccines: VaccineScheduleEntry[]
}

function buildVisitGroups(): VisitGroup[] {
  const seen = new Set<string>()
  const groups: VisitGroup[] = []
  for (const v of VACCINE_SCHEDULE) {
    if (!seen.has(v.ageLabel)) {
      seen.add(v.ageLabel)
      groups.push({
        label: v.ageLabel,
        ageDays: v.minAgeDays,
        vaccines: VACCINE_SCHEDULE.filter(s => s.ageLabel === v.ageLabel),
      })
    }
  }
  return groups
}

export const VISIT_GROUPS = buildVisitGroups()

export interface Child {
  id: string
  user_id: string
  name: string
  dob: string
  created_at: string
}

export interface VaccineRecord {
  id: string
  user_id: string
  child_id: string
  vaccine_key: string
  date_given: string
  provider?: string
  lot_number?: string
  notes?: string
  created_at: string
}

export function getAgeDays(dob: string): number {
  const birth = new Date(dob + 'T00:00:00')
  const now = new Date()
  return Math.floor((now.getTime() - birth.getTime()) / 86400000)
}

export function formatAge(ageDays: number): string {
  if (ageDays < 14) return `${ageDays} days old`
  if (ageDays < 60) return `${Math.round(ageDays / 7)} weeks old`
  const months = Math.floor(ageDays / 30.44)
  if (months < 24) return `${months} months old`
  const years = Math.floor(ageDays / 365.25)
  const remMonths = Math.floor((ageDays - years * 365.25) / 30.44)
  return remMonths > 0 ? `${years}y ${remMonths}m old` : `${years} years old`
}

export function getScheduleStatus(
  entry: VaccineScheduleEntry,
  ageDays: number,
  record?: VaccineRecord
): 'given' | 'due' | 'upcoming' | 'overdue' | 'missed' {
  if (record) return 'given'
  if (entry.maxAgeDays === 99999) return ageDays >= entry.minAgeDays ? 'due' : 'upcoming'
  if (ageDays > entry.maxAgeDays + 60) return 'missed'
  if (ageDays > entry.maxAgeDays) return 'overdue'
  if (ageDays >= entry.minAgeDays - 14) return 'due'
  return 'upcoming'
}
