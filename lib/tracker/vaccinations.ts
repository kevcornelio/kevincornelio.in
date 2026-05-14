// CDC-recommended childhood vaccination schedule (0–6 years)
// https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html

export interface VaccineScheduleEntry {
  key: string        // unique identifier stored in DB
  vaccine: string    // display name
  dose: number       // dose number in series
  minAgeMonths: number
  maxAgeMonths: number
  catchUpMaxAgeMonths?: number
  series: number     // total doses in series
  notes?: string
}

export const VACCINE_SCHEDULE: VaccineScheduleEntry[] = [
  // Hepatitis B
  { key: 'hepb_1', vaccine: 'Hepatitis B (HepB)', dose: 1, minAgeMonths: 0, maxAgeMonths: 0, series: 3 },
  { key: 'hepb_2', vaccine: 'Hepatitis B (HepB)', dose: 2, minAgeMonths: 1, maxAgeMonths: 2, series: 3 },
  { key: 'hepb_3', vaccine: 'Hepatitis B (HepB)', dose: 3, minAgeMonths: 6, maxAgeMonths: 18, series: 3 },

  // DTaP
  { key: 'dtap_1', vaccine: 'DTaP', dose: 1, minAgeMonths: 2, maxAgeMonths: 2, series: 5 },
  { key: 'dtap_2', vaccine: 'DTaP', dose: 2, minAgeMonths: 4, maxAgeMonths: 4, series: 5 },
  { key: 'dtap_3', vaccine: 'DTaP', dose: 3, minAgeMonths: 6, maxAgeMonths: 6, series: 5 },
  { key: 'dtap_4', vaccine: 'DTaP', dose: 4, minAgeMonths: 15, maxAgeMonths: 18, series: 5 },
  { key: 'dtap_5', vaccine: 'DTaP', dose: 5, minAgeMonths: 48, maxAgeMonths: 72, series: 5 },

  // Hib
  { key: 'hib_1', vaccine: 'Hib', dose: 1, minAgeMonths: 2, maxAgeMonths: 2, series: 4 },
  { key: 'hib_2', vaccine: 'Hib', dose: 2, minAgeMonths: 4, maxAgeMonths: 4, series: 4 },
  { key: 'hib_3', vaccine: 'Hib', dose: 3, minAgeMonths: 6, maxAgeMonths: 6, series: 4 },
  { key: 'hib_4', vaccine: 'Hib', dose: 4, minAgeMonths: 12, maxAgeMonths: 15, series: 4 },

  // Polio (IPV)
  { key: 'ipv_1', vaccine: 'Polio (IPV)', dose: 1, minAgeMonths: 2, maxAgeMonths: 2, series: 4 },
  { key: 'ipv_2', vaccine: 'Polio (IPV)', dose: 2, minAgeMonths: 4, maxAgeMonths: 4, series: 4 },
  { key: 'ipv_3', vaccine: 'Polio (IPV)', dose: 3, minAgeMonths: 6, maxAgeMonths: 18, series: 4 },
  { key: 'ipv_4', vaccine: 'Polio (IPV)', dose: 4, minAgeMonths: 48, maxAgeMonths: 72, series: 4 },

  // PCV (Pneumococcal)
  { key: 'pcv_1', vaccine: 'PCV (Pneumococcal)', dose: 1, minAgeMonths: 2, maxAgeMonths: 2, series: 4 },
  { key: 'pcv_2', vaccine: 'PCV (Pneumococcal)', dose: 2, minAgeMonths: 4, maxAgeMonths: 4, series: 4 },
  { key: 'pcv_3', vaccine: 'PCV (Pneumococcal)', dose: 3, minAgeMonths: 6, maxAgeMonths: 6, series: 4 },
  { key: 'pcv_4', vaccine: 'PCV (Pneumococcal)', dose: 4, minAgeMonths: 12, maxAgeMonths: 15, series: 4 },

  // Rotavirus
  { key: 'rv_1', vaccine: 'Rotavirus (RV)', dose: 1, minAgeMonths: 2, maxAgeMonths: 2, catchUpMaxAgeMonths: 3, series: 3 },
  { key: 'rv_2', vaccine: 'Rotavirus (RV)', dose: 2, minAgeMonths: 4, maxAgeMonths: 4, catchUpMaxAgeMonths: 5, series: 3 },
  { key: 'rv_3', vaccine: 'Rotavirus (RV)', dose: 3, minAgeMonths: 6, maxAgeMonths: 6, catchUpMaxAgeMonths: 8, series: 3 },

  // MMR
  { key: 'mmr_1', vaccine: 'MMR', dose: 1, minAgeMonths: 12, maxAgeMonths: 15, series: 2 },
  { key: 'mmr_2', vaccine: 'MMR', dose: 2, minAgeMonths: 48, maxAgeMonths: 72, series: 2 },

  // Varicella
  { key: 'var_1', vaccine: 'Varicella', dose: 1, minAgeMonths: 12, maxAgeMonths: 15, series: 2 },
  { key: 'var_2', vaccine: 'Varicella', dose: 2, minAgeMonths: 48, maxAgeMonths: 72, series: 2 },

  // Hepatitis A
  { key: 'hepa_1', vaccine: 'Hepatitis A (HepA)', dose: 1, minAgeMonths: 12, maxAgeMonths: 23, series: 2 },
  { key: 'hepa_2', vaccine: 'Hepatitis A (HepA)', dose: 2, minAgeMonths: 18, maxAgeMonths: 30, series: 2, notes: '6–18 months after dose 1' },

  // Influenza (annual starting 6 months)
  { key: 'flu_1', vaccine: 'Influenza (annual)', dose: 1, minAgeMonths: 6, maxAgeMonths: 7, series: 1, notes: 'First year: 2 doses 4 weeks apart' },
]

// Group schedule entries into visit windows for display
export interface VisitGroup {
  label: string
  ageMonths: number
  vaccines: VaccineScheduleEntry[]
}

export const VISIT_GROUPS: VisitGroup[] = [
  { label: 'Birth', ageMonths: 0, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths === 0) },
  { label: '1–2 months', ageMonths: 1, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths === 1) },
  { label: '2 months', ageMonths: 2, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths === 2) },
  { label: '4 months', ageMonths: 4, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths === 4) },
  { label: '6 months', ageMonths: 6, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths === 6) },
  { label: '12–15 months', ageMonths: 12, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths >= 12 && v.minAgeMonths <= 15) },
  { label: '15–18 months', ageMonths: 15, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths > 15 && v.minAgeMonths <= 18) },
  { label: '18–30 months', ageMonths: 18, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths > 18 && v.minAgeMonths <= 30) },
  { label: '4–6 years', ageMonths: 48, vaccines: VACCINE_SCHEDULE.filter(v => v.minAgeMonths >= 48) },
]

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

export function getAgeMonths(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

export function getScheduleStatus(
  entry: VaccineScheduleEntry,
  ageMonths: number,
  record?: VaccineRecord
): 'given' | 'due' | 'upcoming' | 'overdue' | 'missed' {
  if (record) return 'given'
  const catchUpMax = entry.catchUpMaxAgeMonths ?? entry.maxAgeMonths + 6
  if (catchUpMax < ageMonths) return 'missed'
  if (ageMonths >= entry.minAgeMonths && ageMonths <= entry.maxAgeMonths + 2) return 'due'
  if (ageMonths > entry.maxAgeMonths + 2 && ageMonths <= catchUpMax) return 'overdue'
  return 'upcoming'
}
