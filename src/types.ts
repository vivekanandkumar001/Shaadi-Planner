export type Page = "dashboard" | "budget" | "guests" | "seating" | "vendors" | "functions" | "checklist" | "shagun" | "menu" | "notes"
export type CityTier = "metro" | "tier2" | "tier3"
export type Side = "bride" | "groom" | "common"
export type RSVP = "confirmed" | "pending" | "declined"
export type MealPref = "veg" | "nonveg" | "jain"
export type VendorCategory = "venue" | "catering" | "decoration" | "photography" | "music" | "mehendi" | "makeup" | "transport" | "invitation" | "pandit" | "other"
export type VendorStatus = "enquired" | "booked" | "paid" | "completed" | "cancelled"
export type ChecklistCategory = "venue" | "catering" | "outfits" | "decor" | "invites" | "beauty" | "legal" | "honeymoon" | "other"
export type ChecklistPriority = "high" | "medium" | "low"
export type GiftType = "cash" | "cheque" | "gift" | "online"

export interface Guest {
  id: string
  name: string
  side: Side
  rsvp: RSVP
  meal: MealPref
  plusOnes: number
  tableId: string | null
  phone: string
}

export interface TableData {
  id: string
  name: string
  capacity: number
}

export interface BudgetState {
  eventName: string
  cityTier: CityTier
  guestCount: string
  eventDays: string
  totalBudget: string
  generated: boolean
}

export interface Vendor {
  id: string
  name: string
  category: VendorCategory
  contact: string
  quotedAmount: number
  paidAmount: number
  status: VendorStatus
  notes: string
}

export interface WeddingFunction {
  id: string
  name: string
  hindiName: string
  date: string
  time: string
  venue: string
  dresscode: string
  notes: string
  color: string
}

export interface ChecklistItem {
  id: string
  task: string
  category: ChecklistCategory
  priority: ChecklistPriority
  dueDate: string
  done: boolean
}

export interface ShagunEntry {
  id: string
  guestName: string
  amount: number
  type: GiftType
  description: string
  date: string
}

export interface MenuCourse {
  id: string
  name: string
  hindiName: string
  items: string[]
  mealType: "veg" | "nonveg" | "both"
}

export interface Note {
  id: string
  title: string
  content: string
  color: string
  createdAt: string
}

export interface AppState {
  planCode: string
  weddingDate: string
  coupleName: string
  budget: BudgetState
  guests: Guest[]
  tables: TableData[]
  vendors: Vendor[]
  functions: WeddingFunction[]
  checklist: ChecklistItem[]
  shagun: ShagunEntry[]
  menuCourses: MenuCourse[]
  notes: Note[]
}
