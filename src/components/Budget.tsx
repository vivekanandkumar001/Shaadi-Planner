import { BudgetState, CityTier, Vendor } from "../types"
import { formatINR, inp, btnPrimary } from "../utils"

interface Props {
  budget: BudgetState
  vendors: Vendor[]
  onChange: (b: BudgetState) => void
}

const CATS: Record<CityTier, Array<{ name: string; hindi: string; pct: number }>> = {
  metro: [
    { name: "Venue", hindi: "स्थान", pct: 18 },
    { name: "Catering", hindi: "खानपान", pct: 30 },
    { name: "Decoration", hindi: "सजावट", pct: 10 },
    { name: "Photography / Video", hindi: "फोटोग्राफी", pct: 8 },
    { name: "Music / DJ / Band", hindi: "संगीत", pct: 4 },
    { name: "Bridal Wear", hindi: "दुल्हन की पोशाक", pct: 8 },
    { name: "Groom Wear", hindi: "दूल्हे की पोशाक", pct: 3 },
    { name: "Jewelry", hindi: "गहने", pct: 5 },
    { name: "Mehendi / Makeup", hindi: "मेहंदी", pct: 3 },
    { name: "Invitations", hindi: "निमंत्रण", pct: 2 },
    { name: "Baraat", hindi: "बारात", pct: 4 },
    { name: "Pandit / Rituals", hindi: "पंडित", pct: 1 },
    { name: "Return Gifts", hindi: "उपहार", pct: 3 },
    { name: "Miscellaneous", hindi: "विविध", pct: 1 },
  ],
  tier2: [
    { name: "Venue", hindi: "स्थान", pct: 14 },
    { name: "Catering", hindi: "खानपान", pct: 33 },
    { name: "Decoration", hindi: "सजावट", pct: 11 },
    { name: "Photography / Video", hindi: "फोटोग्राफी", pct: 7 },
    { name: "Music / DJ / Band", hindi: "संगीत", pct: 4 },
    { name: "Bridal Wear", hindi: "दुल्हन की पोशाक", pct: 9 },
    { name: "Groom Wear", hindi: "दूल्हे की पोशाक", pct: 4 },
    { name: "Jewelry", hindi: "गहने", pct: 5 },
    { name: "Mehendi / Makeup", hindi: "मेहंदी", pct: 3 },
    { name: "Invitations", hindi: "निमंत्रण", pct: 2 },
    { name: "Baraat", hindi: "बारात", pct: 4 },
    { name: "Pandit / Rituals", hindi: "पंडित", pct: 1 },
    { name: "Return Gifts", hindi: "उपहार", pct: 2 },
    { name: "Miscellaneous", hindi: "विविध", pct: 1 },
  ],
  tier3: [
    { name: "Venue", hindi: "स्थान", pct: 10 },
    { name: "Catering", hindi: "खानपान", pct: 36 },
    { name: "Decoration", hindi: "सजावट", pct: 12 },
    { name: "Photography / Video", hindi: "फोटोग्राफी", pct: 6 },
    { name: "Music / DJ / Band", hindi: "संगीत", pct: 4 },
    { name: "Bridal Wear", hindi: "दुल्हन की पोशाक", pct: 10 },
    { name: "Groom Wear", hindi: "दूल्हे की पोशाक", pct: 4 },
    { name: "Jewelry", hindi: "गहने", pct: 6 },
    { name: "Mehendi / Makeup", hindi: "मेहंदी", pct: 3 },
    { name: "Invitations", hindi: "निमंत्रण", pct: 2 },
    { name: "Baraat", hindi: "बारात", pct: 3 },
    { name: "Pandit / Rituals", hindi: "पंडित", pct: 2 },
    { name: "Return Gifts", hindi: "उपहार", pct: 1 },
    { name: "Miscellaneous", hindi: "विविध", pct: 1 },
  ],
}

export default function Budget({ budget, vendors, onChange }: Props) {
  const totalBudget = parseFloat(budget.totalBudget) || 0
  const guestCount = parseInt(budget.guestCount) || 1
  const totalPaid = vendors.reduce((s, v) => s + v.paidAmount, 0)
  const totalQuoted = vendors.reduce((s, v) => s + v.quotedAmount, 0)
  const budgetRemaining = totalBudget - totalPaid

  const breakdown =
    budget.generated
      ? CATS[budget.cityTier].map((c) => ({
          ...c,
          amount: (totalBudget * c.pct) / 100,
          perGuest: (totalBudget * c.pct) / 100 / guestCount,
        }))
      : []

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {totalBudget > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Budget", value: formatINR(totalBudget), color: "#2C1810" },
            { label: "Paid to Vendors", value: formatINR(totalPaid), color: "#8B1D3B" },
            { label: "Committed", value: formatINR(totalQuoted), color: "#D4900A" },
            { label: "Remaining", value: formatINR(budgetRemaining), color: budgetRemaining < 0 ? "#DC2626" : "#166534" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8D5B7] p-4">
              <div className="font-playfair text-xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-[#9B8B7A] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Calculator form */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-6">
        <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-1">
          बजट कैलकुलेटर
        </h2>
        <p className="text-xs text-[#9B8B7A] mb-5">Budget Calculator — category-wise breakdown</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-[#6B5744] mb-1">
              Event / Couple Name
            </label>
            <input
              type="text"
              value={budget.eventName}
              onChange={(e) => onChange({ ...budget, eventName: e.target.value, generated: false })}
              placeholder="e.g. Priya weds Arjun"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">City Tier</label>
            <select
              value={budget.cityTier}
              onChange={(e) => onChange({ ...budget, cityTier: e.target.value as CityTier, generated: false })}
              className={inp}
            >
              <option value="metro">Metro — Mumbai, Delhi, Bengaluru</option>
              <option value="tier2">Tier-2 — Jaipur, Pune, Surat</option>
              <option value="tier3">Tier-3 — Smaller cities</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">
              Total Guests (मेहमान)
            </label>
            <input
              type="number"
              min="1"
              value={budget.guestCount}
              onChange={(e) => onChange({ ...budget, guestCount: e.target.value, generated: false })}
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">
              Event Days (दिन)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={budget.eventDays}
              onChange={(e) => onChange({ ...budget, eventDays: e.target.value, generated: false })}
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">
              Total Budget ₹
            </label>
            <input
              type="number"
              min="0"
              value={budget.totalBudget}
              onChange={(e) => onChange({ ...budget, totalBudget: e.target.value, generated: false })}
              className={inp}
            />
          </div>
        </div>
        <button
          onClick={() => onChange({ ...budget, generated: true })}
          className={btnPrimary + " mt-5"}
        >
          बजट बनाएं / Generate Breakdown
        </button>
      </div>

      {/* Breakdown table */}
      {budget.generated && breakdown.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] overflow-hidden">
          <div
            style={{ background: "linear-gradient(135deg, #8B1D3B 0%, #5A1228 100%)" }}
            className="px-6 py-5 text-white flex items-start justify-between flex-wrap gap-3"
          >
            <div>
              <h3 className="font-playfair text-lg font-bold">
                {budget.eventName || "Your Wedding"} — Breakdown
              </h3>
              <p style={{ color: "#F5C6C6" }} className="text-xs mt-0.5">
                {guestCount.toLocaleString()} guests ·{" "}
                {budget.eventDays} days ·{" "}
                {budget.cityTier === "metro" ? "Metro" : budget.cityTier === "tier2" ? "Tier-2" : "Tier-3"} city
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl" style={{ color: "#D4900A" }}>
                {formatINR(totalBudget)}
              </div>
              <div style={{ color: "#F5C6C6" }} className="text-xs">
                Total Budget
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FEF0D7] text-[#6B5744] border-b border-[#E8D5B7]">
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">हिंदी</th>
                  <th className="text-right px-5 py-3 font-medium">Share</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                  <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Per Guest</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((c, i) => (
                  <tr
                    key={c.name}
                    className={`border-t border-[#F0E6D3] hover:bg-[#FFFBF5] transition-colors ${i % 2 ? "bg-[#FFFBF5]" : ""}`}
                  >
                    <td className="px-5 py-3 font-medium text-[#2C1810]">{c.name}</td>
                    <td className="px-5 py-3 text-[#9B8B7A] hidden sm:table-cell">{c.hindi}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-[#F0E6D3] rounded-full h-1.5 hidden sm:block">
                          <div
                            className="bg-[#D4900A] h-1.5 rounded-full"
                            style={{ width: `${(c.pct / 36) * 100}%` }}
                          />
                        </div>
                        <span className="text-[#6B5744] w-8 text-right">{c.pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-[#8B1D3B] font-mono">
                      {formatINR(c.amount)}
                    </td>
                    <td className="px-5 py-3 text-right text-[#9B8B7A] hidden md:table-cell font-mono text-xs">
                      {formatINR(c.perGuest)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#D4900A] bg-[#FEF0D7]">
                  <td className="px-5 py-3 font-bold text-[#2C1810]" colSpan={2}>
                    Total
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[#6B5744]">100%</td>
                  <td className="px-5 py-3 text-right font-bold text-[#8B1D3B] font-mono">
                    {formatINR(totalBudget)}
                  </td>
                  <td className="px-5 py-3 text-right text-[#9B8B7A] hidden md:table-cell font-mono text-xs">
                    {formatINR(totalBudget / guestCount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
