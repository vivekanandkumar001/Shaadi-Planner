import { useState, useEffect } from "react"
import { Page } from "./types"
import { authApi, weddingsApi, searchApi } from "./api"

import LandingPage from "./components/LandingPage"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import ForgotPassword from "./components/Auth/ForgotPassword"
import Onboarding from "./components/Auth/Onboarding"

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

import PrivacyPolicy from "./components/Legal/PrivacyPolicy"
import TermsOfService from "./components/Legal/TermsOfService"
import MigrateModal from "./components/MigrateModal"
import ShareModal from "./components/ShareModal"
import ExportModal from "./components/ExportModal"
import PublicShareView from "./components/PublicShareView"

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

export default function App() {
  const [route, setRoute] = useState<string>("landing")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [weddings, setWeddings] = useState<any[]>([])
  const [activeWedding, setActiveWedding] = useState<any>(null)
  const [page, setPage] = useState<Page>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Modals & Search State
  const [showMigrateModal, setShowMigrateModal] = useState(false)
  const [legacyLocalData, setLegacyLocalData] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [shareToken, setShareToken] = useState<string | null>(null)

  // Check URL for public share links
  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith("/share/")) {
      const token = path.replace("/share/", "")
      setShareToken(token)
      setRoute("public_share")
      setLoading(false)
      return
    }

    // Check auth on startup
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    const res = await authApi.getMe()
    if (res.success && res.data?.user) {
      setCurrentUser(res.data.user)
      await fetchWeddings()

      // Check legacy local data
      const saved = localStorage.getItem("shaadi_saathi_v2")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setLegacyLocalData(parsed)
          setShowMigrateModal(true)
        } catch {}
      }
      setRoute("app")
    } else {
      setRoute("landing")
    }
    setLoading(false)
  }

  const fetchWeddings = async () => {
    const res = await weddingsApi.getAll()
    if (res.success && res.data?.weddings) {
      const list = res.data.weddings
      setWeddings(list)
      if (list.length > 0) {
        loadWeddingDetails(list[0].id)
      } else {
        setRoute("onboarding")
      }
    }
  }

  const loadWeddingDetails = async (weddingId: string) => {
    const res = await weddingsApi.getOne(weddingId)
    if (res.success && res.data) {
      setActiveWedding(res.data.wedding)
    }
  }

  // Handle Auth Success
  const handleAuthSuccess = (user: any, token: string) => {
    if (token) {
      localStorage.setItem("shaadi_auth_token", token)
    }
    setCurrentUser(user)
    fetchWeddings()
    setRoute("app")
  }

  // Handle Logout
  const handleLogout = async () => {
    await authApi.logout()
    localStorage.removeItem("shaadi_auth_token")
    setCurrentUser(null)
    setActiveWedding(null)
    setRoute("landing")
  }

  // Global Search Handler
  useEffect(() => {
    if (!searchQuery || !activeWedding?.id) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const res = await searchApi.search(activeWedding.id, searchQuery)
      if (res.success && res.data) {
        setSearchResults(res.data.results || [])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, activeWedding?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-bounce">💍</div>
          <div className="text-xs font-semibold text-[#8B1D3B]">Loading Shaadi Planner Platform...</div>
        </div>
      </div>
    )
  }

  // Route: Public Shared View
  if (route === "public_share" && shareToken) {
    return <PublicShareView token={shareToken} />
  }

  // Route: Landing Page
  if (route === "landing") {
    return (
      <LandingPage
        onNavigateToAuth={(mode) => setRoute(mode)}
        onNavigateToLegal={(page) => setRoute(page)}
      />
    )
  }

  // Route: Login
  if (route === "login") {
    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onNavigateToRegister={() => setRoute("register")}
        onNavigateToForgotPassword={() => setRoute("forgot-password")}
        onBackToLanding={() => setRoute("landing")}
      />
    )
  }

  // Route: Register
  if (route === "register") {
    return (
      <Register
        onRegisterSuccess={handleAuthSuccess}
        onNavigateToLogin={() => setRoute("login")}
        onBackToLanding={() => setRoute("landing")}
      />
    )
  }

  // Route: Forgot Password
  if (route === "forgot-password") {
    return <ForgotPassword onBackToLogin={() => setRoute("login")} />
  }

  // Route: Onboarding
  if (route === "onboarding") {
    return (
      <Onboarding
        onComplete={(newWedding) => {
          setActiveWedding(newWedding)
          fetchWeddings()
          setRoute("app")
        }}
      />
    )
  }

  // Route: Legal Pages
  if (route === "privacy") {
    return <PrivacyPolicy onBack={() => setRoute("landing")} />
  }
  if (route === "terms") {
    return <TermsOfService onBack={() => setRoute("landing")} />
  }

  // Helper State Conversion for Legacy Components
  const fullAppState = activeWedding
    ? {
        planCode: activeWedding.id.substring(0, 8).toUpperCase(),
        weddingDate: activeWedding.weddingDate || "",
        coupleName: `${activeWedding.brideName} & ${activeWedding.groomName}`,
        budget: {
          eventName: activeWedding.title,
          cityTier: activeWedding.cityTier || "metro",
          guestCount: String(activeWedding.estimatedGuests || 300),
          eventDays: String(activeWedding.eventDays || 3),
          totalBudget: String(activeWedding.estimatedBudget || 2500000),
          generated: true,
        },
        guests: activeWedding.guests || [],
        tables: activeWedding.tables || [],
        vendors: activeWedding.vendors || [],
        functions: activeWedding.functions || [],
        checklist: activeWedding.checklistItems || [],
        shagun: activeWedding.shagunEntries || [],
        menuCourses: activeWedding.menuCourses || [],
        notes: activeWedding.notesItems || [],
      }
    : null

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
    <div style={{ fontFamily: "var(--font-poppins)", background: "#FDF6EC" }} className="flex h-screen overflow-hidden">
      {/* Modals */}
      {showMigrateModal && legacyLocalData && (
        <MigrateModal
          localData={legacyLocalData}
          onClose={() => setShowMigrateModal(false)}
          onSuccess={() => {
            setShowMigrateModal(false)
            fetchWeddings()
          }}
        />
      )}

      {showShareModal && activeWedding && (
        <ShareModal weddingId={activeWedding.id} onClose={() => setShowShareModal(false)} />
      )}

      {showExportModal && activeWedding && (
        <ExportModal weddingId={activeWedding.id} onClose={() => setShowExportModal(false)} />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "230px", background: "#3A0C1A" }}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="cursor-pointer" onClick={() => setRoute("landing")}>
            <h1 className="font-playfair text-xl font-bold text-white leading-tight">
              Shaadi <span style={{ color: "#D4900A" }}>Planner</span>
            </h1>
            <p className="text-[10px]" style={{ color: "rgba(255,200,200,0.6)" }}>
              Cloud Wedding SaaS
            </p>
          </div>
        </div>

        {/* Active Wedding Selector */}
        <div className="px-4 py-3 border-b space-y-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-[10px] text-amber-200/60 uppercase font-semibold">Active Wedding</div>
          <select
            value={activeWedding?.id || ""}
            onChange={(e) => {
              if (e.target.value === "NEW") {
                setRoute("onboarding")
              } else {
                loadWeddingDetails(e.target.value)
              }
            }}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none"
            style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}
          >
            {weddings.map((w) => (
              <option key={w.id} value={w.id} style={{ background: "#3A0C1A" }}>
                {w.brideName} & {w.groomName}
              </option>
            ))}
            <option value="NEW" style={{ background: "#3A0C1A" }}>+ Create New Wedding</option>
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(({ page: p, icon, label, hindi }) => {
            const active = page === p
            return (
              <button
                key={p}
                onClick={() => {
                  setPage(p)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                style={{
                  background: active ? "rgba(212,144,10,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #D4900A" : "3px solid transparent",
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

        {/* User Account & Logout */}
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="min-w-0">
            <div className="text-xs font-medium text-white truncate">{currentUser?.name}</div>
            <div className="text-[10px] text-amber-200/50 truncate">{currentUser?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="text-rose-300 hover:text-rose-100 text-xs font-bold px-2 py-1 bg-white/10 rounded"
          >
            ↪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <style>{`@media (min-width: 1024px) { .ss-main { margin-left: 230px; } }`}</style>

        {/* Top Navigation Bar */}
        <header
          className="ss-main sticky top-0 z-20 flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b shadow-sm bg-white"
          style={{ borderColor: "#E8D5B7" }}
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

          {/* Global Search + Share & Export Action Bar */}
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guests, vendors, tasks..."
                className="text-xs px-3 py-1.5 pl-8 rounded-lg border border-[#E8D5B7] bg-[#FFFBF5] focus:outline-none focus:ring-1 focus:ring-[#8B1D3B] w-36 sm:w-48"
              />
              <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">🔍</span>

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-[#E8D5B7] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1 text-xs">
                  {searchResults.map((res: any) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => {
                        setPage(res.page)
                        setSearchQuery("")
                        setSearchResults([])
                      }}
                      className="w-full text-left p-2 hover:bg-[#FFFBF5] rounded-lg transition-colors border-b border-amber-50 last:border-0"
                    >
                      <div className="font-semibold text-[#8B1D3B]">{res.title}</div>
                      <div className="text-[10px] text-slate-500">{res.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="bg-[#FFFBF5] hover:bg-amber-100/60 border border-[#E8D5B7] text-[#8B1D3B] font-medium px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
            >
              <span>🔗</span> <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>📊</span> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="ss-main flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {fullAppState && (
              <>
                {page === "dashboard" && (
                  <Dashboard
                    state={fullAppState}
                    onNavigate={(p) => setPage(p)}
                  />
                )}

                {page === "budget" && (
                  <Budget
                    budget={fullAppState.budget}
                    vendors={fullAppState.vendors}
                    onChange={async (b) => {
                      if (activeWedding?.id) {
                        await weddingsApi.update(activeWedding.id, {
                          estimatedBudget: Number(b.totalBudget),
                          cityTier: b.cityTier,
                          estimatedGuests: Number(b.guestCount),
                          eventDays: Number(b.eventDays),
                        })
                        loadWeddingDetails(activeWedding.id)
                      }
                    }}
                  />
                )}

                {page === "guests" && (
                  <Guests
                    weddingId={activeWedding?.id}
                    guests={fullAppState.guests}
                    tables={fullAppState.tables}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "seating" && (
                  <Seating
                    weddingId={activeWedding?.id}
                    tables={fullAppState.tables}
                    guests={fullAppState.guests}
                    onTablesChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                    onGuestsChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "vendors" && (
                  <Vendors
                    weddingId={activeWedding?.id}
                    vendors={fullAppState.vendors}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "functions" && (
                  <Functions
                    weddingId={activeWedding?.id}
                    functions={fullAppState.functions}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "checklist" && (
                  <Checklist
                    weddingId={activeWedding?.id}
                    items={fullAppState.checklist}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "shagun" && (
                  <Shagun
                    weddingId={activeWedding?.id}
                    entries={fullAppState.shagun}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "menu" && (
                  <Menu
                    weddingId={activeWedding?.id}
                    courses={fullAppState.menuCourses}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}

                {page === "notes" && (
                  <Notes
                    weddingId={activeWedding?.id}
                    notes={fullAppState.notes}
                    onChange={() => activeWedding?.id && loadWeddingDetails(activeWedding.id)}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
