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
  { page: "guests", icon: "👥", label: "Add Guest", color: "#8B1D3B" },
  { page: "vendors", icon: "🤝", label: "Add Vendor", color: "#D4900A" },
  { page: "checklist", icon: "✅", label: "View Tasks", color: "#166534" },
  { page: "shagun", icon: "🎁", label: "Log Gift", color: "#7C3AED" },
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
    <div className="space-y-6">
      {/* Countdown hero */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #8B1D3B 0%, #5A1228 60%, #3A0C1A 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #D4900A 0%, transparent 50%), radial-gradient(circle at 20% 80%, #D4900A 0%, transparent 50%)",
          }}
        />
        <div className="relative px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[#F5C6C6] text-xs font-medium uppercase tracking-widest mb-1">
              शादी Saathi
            </p>
            <h1
              className="font-playfair text-3xl font-bold text-white mb-1"
            >
              {state.coupleName || "Your Wedding"}
            </h1>
            <p className="text-[#F5C6C6] text-sm">
              {state.weddingDate
                ? new Date(state.weddingDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Set your wedding date →"}
            </p>
          </div>
          {days !== null && (
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-5 border border-white/20">
              <div
                className="font-playfair font-bold leading-none"
                style={{ fontSize: "3.5rem", color: "#D4900A" }}
              >
                {days < 0 ? "🎊" : days === 0 ? "🎉" : days}
              </div>
              <div className="text-[#F5C6C6] text-xs mt-1 uppercase tracking-wide">
                {days < 0 ? "Married!" : days === 0 ? "Today!" : "days to go"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Guests Confirmed",
            hindi: "मेहमान",
            value: `${confirmedGuests}/${state.guests.length}`,
            sub: `${totalHeadcount} total headcount`,
            color: "#8B1D3B",
            page: "guests" as Page,
          },
          {
            label: "Budget Used",
            hindi: "बजट",
            value: totalBudget ? `${Math.round((totalPaid / totalBudget) * 100)}%` : "—",
            sub: `${formatINR(totalPaid)} of ${formatINR(totalBudget)}`,
            color: "#D4900A",
            page: "budget" as Page,
          },
          {
            label: "Vendors Booked",
            hindi: "विक्रेता",
            value: `${bookedVendors}/${state.vendors.length}`,
            sub: `${formatINR(totalPaid)} paid so far`,
            color: "#166534",
            page: "vendors" as Page,
          },
          {
            label: "Tasks Done",
            hindi: "कार्य",
            value: `${doneTasks}/${totalTasks}`,
            sub: shagunTotal > 0 ? `${formatINR(shagunTotal)} shagun received` : "Checklist progress",
            color: "#7C3AED",
            page: "checklist" as Page,
          },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.page)}
            className="bg-white rounded-2xl border border-[#E8D5B7] p-4 text-left hover:border-[#D4900A] hover:shadow-sm transition-all group"
          >
            <div
              className="font-playfair text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-[#2C1810] mt-1">{stat.label}</div>
            <div className="text-[10px] text-[#9B8B7A] mt-0.5">{stat.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming functions */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8D5B7] flex items-center justify-between">
            <h2 className="font-playfair font-bold text-[#8B1D3B]">
              Upcoming Rasam <span className="text-sm font-normal text-[#9B8B7A]">/ रस्में</span>
            </h2>
            <button
              onClick={() => onNavigate("functions")}
              className="text-xs text-[#D4900A] hover:text-[#8B1D3B] font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          {upcomingFns.length > 0 ? (
            <div className="divide-y divide-[#F0E6D3]">
              {upcomingFns.map((fn) => {
                const d = daysUntil(fn.date)
                return (
                  <div key={fn.id} className="px-5 py-3 flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: fn.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#2C1810]">{fn.name}</div>
                      <div className="text-xs text-[#9B8B7A]">
                        {fn.hindiName} · {fn.date ? new Date(fn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Date TBD"}
                        {fn.venue ? ` · ${fn.venue}` : ""}
                      </div>
                    </div>
                    {d !== null && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: d <= 7 ? "#FEF2F2" : "#FEF0D7",
                          color: d <= 7 ? "#B91C1C" : "#D4900A",
                        }}
                      >
                        {d === 0 ? "Today" : d < 0 ? "Done" : `${d}d`}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-[#C4A882]">
              <p className="text-sm">Set ceremony dates on the Functions page</p>
              <button
                onClick={() => onNavigate("functions")}
                className="mt-2 text-xs text-[#8B1D3B] hover:underline"
              >
                Go to Functions →
              </button>
            </div>
          )}
        </div>

        {/* Pending tasks */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8D5B7] flex items-center justify-between">
            <h2 className="font-playfair font-bold text-[#8B1D3B]">
              Pending Tasks <span className="text-sm font-normal text-[#9B8B7A]">/ कार्य</span>
            </h2>
            <button
              onClick={() => onNavigate("checklist")}
              className="text-xs text-[#D4900A] hover:text-[#8B1D3B] font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          {totalTasks > 0 && (
            <div className="px-5 pt-3 pb-2">
              <div className="flex items-center justify-between text-xs text-[#9B8B7A] mb-1">
                <span>{doneTasks} of {totalTasks} complete</span>
                <span>{totalTasks - doneTasks} remaining</span>
              </div>
              <div className="w-full bg-[#F0E6D3] rounded-full h-1.5">
                <div
                  className="bg-[#8B1D3B] h-1.5 rounded-full transition-all"
                  style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
          {pendingTasks.length > 0 ? (
            <div className="divide-y divide-[#F0E6D3]">
              {pendingTasks.map((item) => (
                <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background:
                        item.priority === "high"
                          ? "#DC2626"
                          : item.priority === "medium"
                          ? "#D4900A"
                          : "#9B8B7A",
                    }}
                  />
                  <span className="text-sm text-[#2C1810] flex-1">{item.task}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      background: item.priority === "high" ? "#FEF2F2" : "#FEF0D7",
                      color: item.priority === "high" ? "#B91C1C" : "#92400E",
                    }}
                  >
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-[#C4A882]">
              <p className="text-sm">{totalTasks === 0 ? "Checklist is empty" : "🎉 All tasks complete!"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quick.map((q) => (
          <button
            key={q.page}
            onClick={() => onNavigate(q.page)}
            className="bg-white border border-[#E8D5B7] rounded-xl px-4 py-4 text-center hover:border-[#D4900A] hover:shadow-sm transition-all"
          >
            <div className="text-2xl mb-1">{q.icon}</div>
            <div className="text-xs font-semibold text-[#2C1810]">{q.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
