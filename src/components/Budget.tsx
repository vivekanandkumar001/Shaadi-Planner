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
    <div className="space-y-8 animate-fade-in-up">
      {/* SUMMARY METRICS CARDS */}
      {totalBudget > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Budget", value: formatINR(totalBudget), color: "#1A1617" },
            { label: "Paid to Vendors", value: formatINR(totalPaid), color: "#7A1631" },
            { label: "Committed Quotes", value: formatINR(totalQuoted), color: "#D4AF37" },
            {
              label: "Remaining Balance",
              value: formatINR(budgetRemaining),
              color: budgetRemaining < 0 ? "#EF4444" : "#10B981",
            },
          ].map((s) => (
            <div key={s.label} className="luxury-card p-5 text-left">
              <div className="font-cinzel text-xl sm:text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* CALCULATOR CONFIGURATION FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#EAE0D5] pb-4">
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">
            Budget Calculator & Allocations
          </h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Category-wise financial distribution tailored for Indian weddings</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-medium">
          <div className="lg:col-span-2">
            <label className="block text-[#1A1617] font-semibold mb-1.5">
              Event / Couple Name *
            </label>
            <input
              type="text"
              value={budget.eventName}
              onChange={(e) => onChange({ ...budget, eventName: e.target.value, generated: false })}
              placeholder="e.g. Aarav weds Ananya"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">City Tier *</label>
            <select
              value={budget.cityTier}
              onChange={(e) => onChange({ ...budget, cityTier: e.target.value as CityTier, generated: false })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all cursor-pointer"
            >
              <option value="metro">Metro — Mumbai, Delhi, Bengaluru</option>
              <option value="tier2">Tier-2 — Jaipur, Pune, Udaipur, Surat</option>
              <option value="tier3">Tier-3 — Regional Cities & Towns</option>
            </select>
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">
              Total Guests (मेहमान) *
            </label>
            <input
              type="number"
              min="1"
              value={budget.guestCount}
              onChange={(e) => onChange({ ...budget, guestCount: e.target.value, generated: false })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">
              Event Duration (Days) *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={budget.eventDays}
              onChange={(e) => onChange({ ...budget, eventDays: e.target.value, generated: false })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">
              Total Estimated Budget (₹) *
            </label>
            <input
              type="number"
              min="0"
              value={budget.totalBudget}
              onChange={(e) => onChange({ ...budget, totalBudget: e.target.value, generated: false })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onChange({ ...budget, generated: true })}
            className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            Generate Budget Breakdown ✨
          </button>
        </div>
      </div>

      {/* BREAKDOWN TABLE */}
      {budget.generated && breakdown.length > 0 && (
        <div className="luxury-card overflow-hidden">
          <div className="bg-gradient-to-r from-[#1D060D] via-[#3D0A19] to-[#1D060D] px-6 py-6 text-white flex items-center justify-between flex-wrap gap-4 border-b border-[#D4AF37]/30">
            <div>
              <h3 className="font-playfair text-xl font-bold">
                {budget.eventName || "Wedding Celebration"} — Allocation Breakdown
              </h3>
              <p className="text-xs text-[#E5C358]/80 mt-0.5 font-medium">
                {guestCount.toLocaleString()} Guests • {budget.eventDays} Days •{" "}
                {budget.cityTier === "metro" ? "Metro Tier" : budget.cityTier === "tier2" ? "Tier-2 City" : "Tier-3 City"}
              </p>
            </div>
            <div className="text-right">
              <div className="font-cinzel font-bold text-2xl gold-gradient-text">
                {formatINR(totalBudget)}
              </div>
              <div className="text-[10px] text-[#FCF8F2]/70 uppercase font-semibold">Total Target Budget</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FCF8F2] text-[#7A1631] border-b border-[#EAE0D5] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 hidden sm:table-cell">Hindi</th>
                  <th className="px-6 py-3.5 text-right">Share %</th>
                  <th className="px-6 py-3.5 text-right">Allocated Amount</th>
                  <th className="px-6 py-3.5 text-right hidden md:table-cell">Per Guest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D5]">
                {breakdown.map((c, i) => (
                  <tr
                    key={c.name}
                    className="hover:bg-[#FCF8F2]/60 transition-colors font-medium text-[#1A1617]"
                  >
                    <td className="px-6 py-3.5 font-semibold text-[#7A1631]">{c.name}</td>
                    <td className="px-6 py-3.5 text-[#75676B] hidden sm:table-cell">{c.hindi}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-[#EAE0D5] rounded-full h-1.5 hidden sm:block overflow-hidden">
                          <div
                            className="bg-[#D4AF37] h-1.5 rounded-full"
                            style={{ width: `${(c.pct / 36) * 100}%` }}
                          />
                        </div>
                        <span className="text-[#1A1617] font-semibold">{c.pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-[#7A1631]">
                      {formatINR(c.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-right text-[#75676B] hidden md:table-cell">
                      {formatINR(c.perGuest)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#D4AF37] bg-[#FCF8F2] font-bold text-[#1A1617]">
                  <td className="px-6 py-4 font-playfair text-sm" colSpan={2}>
                    Total Allocation
                  </td>
                  <td className="px-6 py-4 text-right text-[#7A1631]">100%</td>
                  <td className="px-6 py-4 text-right font-cinzel text-sm text-[#7A1631]">
                    {formatINR(totalBudget)}
                  </td>
                  <td className="px-6 py-4 text-right text-[#75676B] hidden md:table-cell">
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
