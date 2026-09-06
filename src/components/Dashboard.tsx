import { AppState, Page } from "../types"
import { formatINR } from "../utils"

interface Props {
  state: AppState
  onNavigate: (p: Page) => void
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

const quick: Array<{ page: Page; icon: string; label: string; color: string }> = [
  { page: "guests", icon: "👥", label: "Add Guest", color: "#7A1631" },
  { page: "vendors", icon: "🤝", label: "Add Vendor", color: "#D4AF37" },
  { page: "checklist", icon: "✅", label: "View Tasks", color: "#10B981" },
  { page: "shagun", icon: "🎁", label: "Log Gift", color: "#8B5CF6" },
]

export default function Dashboard({ state, onNavigate }: Props) {
  const days = daysUntil(state.weddingDate)
  const confirmedGuests = state.guests.filter((g) => g.rsvp === "confirmed").length
  const totalHeadcount = state.guests.reduce((s, g) => s + 1 + g.plusOnes, 0)
  const bookedVendors = state.vendors.filter((v) => v.status !== "enquired" && v.status !== "cancelled").length
  const totalPaid = state.vendors.reduce((s, v) => s + v.paidAmount, 0)
  const totalBudget = parseFloat(state.budget.totalBudget) || 0
  const doneTasks = state.checklist.filter((c) => c.done).length
  const totalTasks = state.checklist.length
  const shagunTotal = state.shagun.reduce((s, e) => s + e.amount, 0)
  const pendingTasks = state.checklist.filter((c) => !c.done).slice(0, 4)
  const upcomingFns = [...state.functions]
    .filter((f) => f.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* COUNTDOWN HERO BANNER */}
      <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#1D060D] via-[#3D0A19] to-[#1D060D] border border-[#D4AF37]/35 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#5C0F24]/80 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-[#E5C358] text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
              👑 Royal Wedding Command Center
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {state.coupleName || "Your Wedding Celebration"}
            </h1>
            <p className="text-sm text-[#FCF8F2]/75 font-medium flex items-center gap-2">
              <span>📅</span>
              <span>
                {state.weddingDate
                  ? new Date(state.weddingDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Set your wedding date →"}
              </span>
            </p>
          </div>

          {days !== null && (
            <div className="text-center bg-[#2D0B16]/80 backdrop-blur-md rounded-2xl px-8 py-5 border border-[#D4AF37]/40 shadow-xl">
              <div className="font-cinzel font-extrabold leading-none gold-gradient-text text-4xl sm:text-5xl">
                {days < 0 ? "🎊" : days === 0 ? "🎉" : days}
              </div>
              <div className="text-[#FCF8F2]/80 text-[10px] mt-2 uppercase font-bold tracking-wider">
                {days < 0 ? "Married!" : days === 0 ? "Today is the Day!" : "Days Remaining"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Guests Confirmed",
            hindi: "मेहमान",
            value: `${confirmedGuests}/${state.guests.length}`,
            sub: `${totalHeadcount} Total Headcount`,
            color: "#7A1631",
            page: "guests" as Page,
            icon: "👥",
          },
          {
            label: "Budget Allocated",
            hindi: "बजट",
            value: totalBudget ? `${Math.round((totalPaid / totalBudget) * 100)}%` : "—",
            sub: `${formatINR(totalPaid)} / ${formatINR(totalBudget)}`,
            color: "#D4AF37",
            page: "budget" as Page,
            icon: "💰",
          },
          {
            label: "Vendors Booked",
            hindi: "विक्रेता",
            value: `${bookedVendors}/${state.vendors.length}`,
            sub: `${formatINR(totalPaid)} Paid`,
            color: "#10B981",
            page: "vendors" as Page,
            icon: "🤝",
          },
          {
            label: "Tasks Done",
            hindi: "कार्य",
            value: `${doneTasks}/${totalTasks}`,
            sub: shagunTotal > 0 ? `${formatINR(shagunTotal)} Shagun` : "Checklist Done",
            color: "#8B5CF6",
            page: "checklist" as Page,
            icon: "✅",
          },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.page)}
            className="luxury-card p-5 text-left flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-[10px] font-bold text-[#75676B] uppercase tracking-wider">{stat.hindi}</span>
            </div>
            <div className="mt-3">
              <div className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#7A1631] group-hover:text-[#5C0F24]">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#1A1617] mt-1">{stat.label}</div>
              <div className="text-[11px] text-[#75676B] font-medium mt-0.5">{stat.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UPCOMING CEREMONIES WIDGET */}
        <div className="luxury-card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#EAE0D5] flex items-center justify-between bg-[#FCF8F2]/60">
            <h2 className="font-playfair font-bold text-[#7A1631] text-base flex items-center gap-2">
              <span>📅</span>
              <span>Upcoming Ceremonies</span>
              <span className="text-xs font-normal text-[#75676B]">/ रस्में</span>
            </h2>
            <button
              onClick={() => onNavigate("functions")}
              className="text-xs text-[#7A1631] hover:text-[#5C0F24] font-semibold transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>

          {upcomingFns.length > 0 ? (
            <div className="divide-y divide-[#EAE0D5] flex-1">
              {upcomingFns.map((fn) => {
                const d = daysUntil(fn.date)
                return (
                  <div key={fn.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FCF8F2]/40 transition-colors">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm border border-white"
                      style={{ background: fn.color || "#7A1631" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#1A1617]">{fn.name}</div>
                      <div className="text-xs text-[#75676B] font-medium">
                        {fn.hindiName ? `${fn.hindiName} • ` : ""}
                        {fn.date ? new Date(fn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Date TBD"}
                        {fn.venue ? ` • ${fn.venue}` : ""}
                      </div>
                    </div>
                    {d !== null && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          d <= 7
                            ? "bg-rose-50 border-rose-200 text-rose-800"
                            : "bg-[#F3E5AB]/40 border-[#D4AF37]/30 text-[#7A1631]"
                        }`}
                      >
                        {d === 0 ? "Today" : d < 0 ? "Finished" : `${d} Days`}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-[#75676B] space-y-3">
              <div className="text-3xl">📅</div>
              <p className="text-xs font-medium">No upcoming function dates configured yet.</p>
              <button
                onClick={() => onNavigate("functions")}
                className="luxury-button-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-block"
              >
                Configure Functions →
              </button>
            </div>
          )}
        </div>

        {/* PENDING TASKS CHECKLIST WIDGET */}
        <div className="luxury-card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#EAE0D5] flex items-center justify-between bg-[#FCF8F2]/60">
            <h2 className="font-playfair font-bold text-[#7A1631] text-base flex items-center gap-2">
              <span>✅</span>
              <span>Pending Tasks</span>
              <span className="text-xs font-normal text-[#75676B]">/ कार्य</span>
            </h2>
            <button
              onClick={() => onNavigate("checklist")}
              className="text-xs text-[#7A1631] hover:text-[#5C0F24] font-semibold transition-colors cursor-pointer"
            >
              View All →
            </button>
          </div>

          {totalTasks > 0 && (
            <div className="px-6 pt-4 pb-2 border-b border-[#EAE0D5]/50">
              <div className="flex items-center justify-between text-xs text-[#75676B] font-semibold mb-1.5">
                <span>{doneTasks} of {totalTasks} Completed</span>
                <span>{Math.round(totalTasks ? (doneTasks / totalTasks) * 100 : 0)}% Progress</span>
              </div>
              <div className="w-full bg-[#EAE0D5] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#7A1631] to-[#D4AF37] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {pendingTasks.length > 0 ? (
            <div className="divide-y divide-[#EAE0D5] flex-1">
              {pendingTasks.map((item) => (
                <div key={item.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-[#FCF8F2]/40 transition-colors">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background:
                        item.priority === "high"
                          ? "#EF4444"
                          : item.priority === "medium"
                          ? "#F59E0B"
                          : "#10B981",
                    }}
                  />
                  <span className="text-xs font-medium text-[#1A1617] flex-1">{item.task}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      item.priority === "high"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : item.priority === "medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#75676B] space-y-2">
              <div className="text-3xl">🎉</div>
              <p className="text-xs font-medium">{totalTasks === 0 ? "Checklist is currently empty." : "All wedding tasks complete!"}</p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK LAUNCHER ACTIONS */}
      <div className="space-y-3">
        <h3 className="font-playfair text-sm font-bold text-[#7A1631] uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quick.map((q) => (
            <button
              key={q.page}
              onClick={() => onNavigate(q.page)}
              className="luxury-card p-4 text-center hover:scale-[1.02] transition-transform cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FCF8F2] border border-[#D4AF37]/30 flex items-center justify-center text-xl mx-auto shadow-sm">
                {q.icon}
              </div>
              <div className="text-xs font-bold text-[#1A1617]">{q.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
