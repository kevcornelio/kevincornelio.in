export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  category?: string
  created_at: string
}

export type FinanceType = 'income' | 'expense'

export interface Finance {
  id: string
  user_id: string
  type: FinanceType
  amount: number
  category: string
  description?: string
  date: string
  created_at: string
}

export interface HealthLog {
  id: string
  user_id: string
  type: string
  value?: number
  unit?: string
  notes?: string
  date: string
  created_at: string
}

export type GoalStatus = 'active' | 'completed' | 'paused'

export interface Milestone {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category?: string
  target_date?: string
  progress: number
  status: GoalStatus
  milestones: Milestone[]
  created_at: string
}
