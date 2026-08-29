import { useState, useEffect } from "react"
import { AppState, Page, WeddingFunction, ChecklistItem, MenuCourse } from "./types"
import Dashboard from "./components/Dashboard"
import Budget from "./components/Budget"
import Guests from "./components/Guests"
import Seating from "./components/Seating"
import Vendors from "./components/Vendors"
import Functions from "./components/Functions"
import Checklist from "./components/Checklist"
import Shagun from "./components/Shagun"
import Menu from "./components/Menu"
import Notes from "./components/Notes"

const DEFAULT_FUNCTIONS: WeddingFunction[] = [
  { id: "fn1", name: "Haldi", hindiName: "हल्दी", date: "", time: "10:00", venue: "", dresscode: "Yellow / Ethnic", notes: "Turmeric ceremony for blessings", color: "#CA8A04" },
  { id: "fn2", name: "Mehendi", hindiName: "मेहंदी", date: "", time: "15:00", venue: "", dresscode: "Green / Ethnic", notes: "Bride's mehendi ceremony", color: "#16A34A" },
  { id: "fn3", name: "Sangeet", hindiName: "संगीत", date: "", time: "19:00", venue: "", dresscode: "Festive / Party", notes: "Music, dance, and celebrations", color: "#7C3AED" },
  { id: "fn4", name: "Baraat", hindiName: "बारात", date: "", time: "18:00", venue: "", dresscode: "Sherwani / Formal", notes: "Groom's procession to venue", color: "#D4900A" },
  { id: "fn5", name: "Vivah", hindiName: "विवाह", date: "", time: "21:00", venue: "", dresscode: "Bridal / Formal", notes: "The wedding ceremony", color: "#8B1D3B" },
  { id: "fn6", name: "Reception", hindiName: "रिसेप्शन", date: "", time: "19:00", venue: "", dresscode: "Formal / Indo-Western", notes: "Post-wedding reception dinner", color: "#0891B2" },
]

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "cl1", task: "Book wedding venue", category: "venue", priority: "high", dueDate: "", done: false },
  { id: "cl2", task: "Finalise guest list", category: "other", priority: "high", dueDate: "", done: false },
  { id: "cl3", task: "Book pandit / priest", category: "other", priority: "high", dueDate: "", done: false },
  { id: "cl4", task: "Book caterer", category: "catering", priority: "high", dueDate: "", done: false },
  { id: "cl5", task: "Book photographer & videographer", category: "other", priority: "high", dueDate: "", done: false },
  { id: "cl6", task: "Book decorator / florist", category: "decor", priority: "high", dueDate: "", done: false },
  { id: "cl7", task: "Order bridal lehenga / saree", category: "outfits", priority: "high", dueDate: "", done: false },
  { id: "cl8", task: "Order groom's sherwani / suit", category: "outfits", priority: "medium", dueDate: "", done: false },
  { id: "cl9", task: "Get marriage certificate / legal paperwork", category: "legal", priority: "high", dueDate: "", done: false },
  { id: "cl10", task: "Design & print invitation cards", category: "invites", priority: "medium", dueDate: "", done: false },
  { id: "cl11", task: "Send invitations to all guests", category: "invites", priority: "medium", dueDate: "", done: false },
  { id: "cl12", task: "Book bridal makeup artist", category: "beauty", priority: "medium", dueDate: "", done: false },
  { id: "cl13", task: "Book mehendi artist", category: "beauty", priority: "medium", dueDate: "", done: false },
  { id: "cl14", task: "Select & buy bridal jewelry", category: "beauty", priority: "medium", dueDate: "", done: false },
  { id: "cl15", task: "Book DJ / band / sangeet performers", category: "other", priority: "medium", dueDate: "", done: false },
  { id: "cl16", task: "Arrange baraat — horse / car / dhol", category: "other", priority: "medium", dueDate: "", done: false },
  { id: "cl17", task: "Book hotel for outstation guests", category: "venue", priority: "medium", dueDate: "", done: false },
  { id: "cl18", task: "Purchase wedding rings", category: "beauty", priority: "high", dueDate: "", done: false },
  { id: "cl19", task: "Arrange return gifts for guests", category: "other", priority: "low", dueDate: "", done: false },
  { id: "cl20", task: "Book honeymoon trip", category: "honeymoon", priority: "low", dueDate: "", done: false },
]

const DEFAULT_MENU: MenuCourse[] = [
  { id: "mn1", name: "Welcome Drinks", hindiName: "स्वागत पेय", items: ["Fresh Lime Soda", "Aam Panna", "Rose Sharbat", "Jaljeera"], mealType: "veg" },
  { id: "mn2", name: "Starters — Veg", hindiName: "स्टार्टर (शाकाहारी)", items: ["Paneer Tikka", "Hara Bhara Kabab", "Dahi Ke Sholey", "Corn Chaat"], mealType: "veg" },
  { id: "mn3", name: "Starters — Non-Veg", hindiName: "स्टार्टर (मांसाहारी)", items: ["Chicken Tikka", "Seekh Kabab", "Fish Amritsari"], mealType: "nonveg" },
  { id: "mn4", name: "Main Course — Veg", hindiName: "मुख्य व्यंजन", items: ["Dal Makhani", "Paneer Butter Masala", "Kadai Paneer", "Jeera Rice", "Naan", "Paratha", "Raita"], mealType: "veg" },
  { id: "mn5", name: "Main Course — Non-Veg", hindiName: "मांसाहारी व्यंजन", items: ["Butter Chicken", "Mutton Rogan Josh"], mealType: "nonveg" },
  { id: "mn6", name: "Biryani Corner", hindiName: "बिरयानी कॉर्नर", items: ["Veg Biryani", "Chicken Biryani", "Mutton Biryani"], mealType: "both" },
  { id: "mn7", name: "Chaat Corner", hindiName: "चाट कॉर्नर", items: ["Pani Puri", "Dahi Puri", "Bhel Puri"], mealType: "veg" },
  { id: "mn8", name: "Desserts", hindiName: "मिठाई", items: ["Gulab Jamun", "Rasgulla", "Kheer", "Gajar Halwa", "Rabri", "Ice Cream"], mealType: "veg" },
]

const INITIAL: AppState = {
  planCode: "",
  weddingDate: "",
  coupleName: "",
  budget: { eventName: "", cityTier: "metro", guestCount: "300", eventDays: "3", totalBudget: "2500000", generated: false },
  guests: [],
  tables: [],
  vendors: [],
  functions: DEFAULT_FUNCTIONS,
  checklist: DEFAULT_CHECKLIST,
  shagun: [],
  menuCourses: DEFAULT_MENU,
  notes: [],
}

const NAV: Array<{ page: Page; icon: string; label: string; hindi: string }> = [
  { page: "dashboard", icon: "🏠", label: "Dashboard", hindi: "होम" },
  { page: "budget", icon: "💰", label: "Budget", hindi: "बजट" },
  { page: "guests", icon: "👥", label: "Guests", hindi: "मेहमान" },
  { page: "seating", icon: "🪑", label: "Seating", hindi: "बैठक" },
  { page: "vendors", icon: "🤝", label: "Vendors", hindi: "विक्रेता" },
  { page: "functions", icon: "📅", label: "Functions", hindi: "रस्में" },
  { page: "checklist", icon: "✅", label: "Checklist", hindi: "सूची" },
  { page: "shagun", icon: "🎁", label: "Shagun", hindi: "शगुन" },
  { page: "menu", icon: "🍽️", label: "Menu", hindi: "मेनू" },
  { page: "notes", icon: "📝", label: "Notes", hindi: "नोट्स" },
]

const PLAN_KEY = "shaadi_saathi_v2"

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL)
  const [page, setPage] = useState<Page>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(PLAN_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        setState({ ...INITIAL, ...d })
        setReady(true)
        return
      } catch {}
    }
    setState((p) => ({ ...p, planCode: genCode() }))
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(PLAN_KEY, JSON.stringify(state))
  }, [state, ready])

  const update = <K extends keyof AppState>(key: K, value: AppState[K]) =>
    setState((p) => ({ ...p, [key]: value }))

  const copyCode = () => {
    navigator.clipboard.writeText(state.planCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const navigate = (p: Page) => {
    setPage(p)
    setSidebarOpen(false)
  }

  const PAGE_TITLES: Record<Page, { en: string; hi: string }> = {
    dashboard: { en: "Dashboard", hi: "होम" },
    budget: { en: "Budget Calculator", hi: "बजट कैलकुलेटर" },
    guests: { en: "Guest List", hi: "मेहमान सूची" },
    seating: { en: "Seating Planner", hi: "बैठक व्यवस्था" },
    vendors: { en: "Vendors", hi: "विक्रेता" },
    functions: { en: "Wedding Functions", hi: "रस्में" },
    checklist: { en: "Checklist", hi: "कार्य सूची" },
    shagun: { en: "Shagun & Gifts", hi: "शगुन" },
    menu: { en: "Wedding Menu", hi: "मेनू" },
    notes: { en: "Notes", hi: "नोट्स" },
  }

  return (
    <div style={{ fontFamily: "var(--font-poppins)", background: "#FDF6EC" }} className="flex h-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "220px", background: "#3A0C1A" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <h1 className="font-playfair text-xl font-bold text-white leading-tight">
            शादी <span style={{ color: "#D4900A" }}>Saathi</span>
          </h1>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,200,200,0.6)" }}>
            Free Indian wedding planner
          </p>
        </div>

        {/* Couple + date setup */}
        <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <input
            type="text"
            value={state.coupleName}
            onChange={(e) => update("coupleName", e.target.value)}
            placeholder="Couple name"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none mb-1.5"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}
          />
          <input
            type="date"
            value={state.weddingDate}
            onChange={(e) => update("weddingDate", e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)", color: state.weddingDate ? "#fff" : "rgba(255,255,255,0.4)", colorScheme: "dark" }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(({ page: p, icon, label, hindi }) => {
            const active = page === p
            return (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                style={{
                  background: active ? "rgba(212,144,10,0.15)" : "transparent",
                  borderLeft: active ? "2px solid #D4900A" : "2px solid transparent",
                  color: active ? "#D4900A" : "rgba(255,220,220,0.7)",
                }}
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-medium leading-tight">{label}</div>
                  <div className="text-[10px] leading-tight" style={{ color: active ? "rgba(212,144,10,0.7)" : "rgba(255,200,200,0.4)" }}>
                    {hindi}
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Plan code */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-[10px] mb-1" style={{ color: "rgba(255,200,200,0.5)" }}>Plan Code</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold" style={{ color: "#D4900A" }}>{state.planCode}</span>
            <button onClick={copyCode} className="text-[10px] transition-colors" style={{ color: copied ? "#D4900A" : "rgba(255,200,200,0.5)" }}>
              {copied ? "✓" : "⎘"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col" style={{ marginLeft: 0 }}>
        <style>{`@media (min-width: 1024px) { .ss-main { margin-left: 220px; } }`}</style>

        {/* Top bar (mobile: hamburger; desktop: page title) */}
        <header
          className="ss-main sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b shadow-sm"
          style={{ background: "white", borderColor: "#E8D5B7" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#8B1D3B] lg:hidden text-xl leading-none"
            >
              ☰
            </button>
            <div>
              <h2 className="font-playfair font-bold text-[#8B1D3B] text-base leading-tight">
                {PAGE_TITLES[page].en}
              </h2>
              <p className="text-[10px] text-[#9B8B7A] leading-tight hidden sm:block">
                {PAGE_TITLES[page].hi}
              </p>
            </div>
          </div>
          {state.coupleName && (
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-[#2C1810]">{state.coupleName}</div>
              {state.weddingDate && (
                <div className="text-[10px] text-[#9B8B7A]">
                  {new Date(state.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
            </div>
          )}
        </header>

        {/* Page */}
        <main
          className="ss-main flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8"
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {page === "dashboard" && <Dashboard state={state} onNavigate={navigate} />}
            {page === "budget" && <Budget budget={state.budget} vendors={state.vendors} onChange={(b) => update("budget", b)} />}
            {page === "guests" && <Guests guests={state.guests} tables={state.tables} onChange={(g) => update("guests", g)} />}
            {page === "seating" && (
              <Seating
                tables={state.tables}
                guests={state.guests}
                onTablesChange={(t) => update("tables", t)}
                onGuestsChange={(g) => update("guests", g)}
              />
            )}
            {page === "vendors" && <Vendors vendors={state.vendors} onChange={(v) => update("vendors", v)} />}
            {page === "functions" && (
              <Functions functions={state.functions} onChange={(f) => update("functions", f)} />
            )}
            {page === "checklist" && (
              <Checklist items={state.checklist} onChange={(c) => update("checklist", c)} />
            )}
            {page === "shagun" && <Shagun entries={state.shagun} onChange={(s) => update("shagun", s)} />}
            {page === "menu" && <Menu courses={state.menuCourses} onChange={(m) => update("menuCourses", m)} />}
            {page === "notes" && <Notes notes={state.notes} onChange={(n) => update("notes", n)} />}
          </div>
        </main>
      </div>
    </div>
  )
}
