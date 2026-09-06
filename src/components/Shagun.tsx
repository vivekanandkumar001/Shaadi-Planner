import { useState } from "react"
import { ShagunEntry, GiftType } from "../types"
import { formatINR, formatINRFull } from "../utils"
import { shagunApi } from "../api"

interface Props {
  entries: ShagunEntry[]
  onChange: (e: ShagunEntry[]) => void
  weddingId?: string
}

const TYPE_STYLE: Record<GiftType, { label: string; bg: string; text: string; emoji: string }> = {
  cash: { label: "Cash", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", emoji: "💵" },
  cheque: { label: "Cheque", bg: "bg-blue-50 border-blue-200", text: "text-blue-800", emoji: "📝" },
  online: { label: "Online UPI/Bank", bg: "bg-purple-50 border-purple-200", text: "text-purple-800", emoji: "📱" },
  gift: { label: "Gift Item", bg: "bg-amber-50 border-amber-200", text: "text-amber-800", emoji: "🎁" },
}

const blank: Omit<ShagunEntry, "id"> = {
  guestName: "", amount: 0, type: "cash", description: "", date: new Date().toISOString().split("T")[0],
}

export default function Shagun({ entries, onChange, weddingId }: Props) {
  const [form, setForm] = useState<Omit<ShagunEntry, "id">>(blank)
  const [filterType, setFilterType] = useState<GiftType | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")
  const [loading, setLoading] = useState(false)

  const total = entries.reduce((s, e) => s + e.amount, 0)
  const cashTotal = entries.filter((e) => e.type === "cash").reduce((s, e) => s + e.amount, 0)
  const onlineTotal = entries.filter((e) => e.type === "online").reduce((s, e) => s + e.amount, 0)
  const chequeTotal = entries.filter((e) => e.type === "cheque").reduce((s, e) => s + e.amount, 0)
  const giftCount = entries.filter((e) => e.type === "gift").length

  const add = async () => {
    if (!form.guestName.trim()) return
    setLoading(true)
    if (weddingId) {
      const res = await shagunApi.create(weddingId, form)
      if (res.success && res.data?.entry) {
        onChange([...entries, res.data.entry])
      }
    } else {
      onChange([...entries, { ...form, id: Math.random().toString(36).substring(2, 9) }])
    }
    setForm({ ...blank, date: new Date().toISOString().split("T")[0] })
    setLoading(false)
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await shagunApi.delete(weddingId, id)
    }
    onChange(entries.filter((e) => e.id !== id))
  }

  const filtered = entries
    .filter((e) => filterType === "all" || e.type === filterType)
    .sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount
      return b.date.localeCompare(a.date)
    })

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* SHAGUN HERO METRICS */}
      <div className="luxury-card overflow-hidden">
        <div className="bg-gradient-to-r from-[#1D060D] via-[#3D0A19] to-[#1D060D] px-8 py-8 text-white flex flex-wrap items-center justify-between gap-6 border-b border-[#D4AF37]/30">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#E5C358] uppercase tracking-widest">
              🎁 Private Financial Shagun Ledger
            </p>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold gold-gradient-text">
              {formatINRFull(total)}
            </h2>
            <p className="text-xs text-[#FCF8F2]/75 font-medium">{entries.length} Total Gift Entries Logged</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#EAE0D5] bg-[#FCF8F2]/50 text-xs p-2">
          <div className="p-4 text-center">
            <div className="text-[#75676B] font-semibold mb-1">💵 Cash Received</div>
            <div className="font-cinzel text-lg font-bold text-[#7A1631]">{formatINR(cashTotal)}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[#75676B] font-semibold mb-1">📱 Online / UPI</div>
            <div className="font-cinzel text-lg font-bold text-purple-700">{formatINR(onlineTotal)}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[#75676B] font-semibold mb-1">📝 Cheques</div>
            <div className="font-cinzel text-lg font-bold text-blue-700">{formatINR(chequeTotal)}</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[#75676B] font-semibold mb-1">🎁 Physical Gifts</div>
            <div className="font-cinzel text-lg font-bold text-[#D4AF37]">{giftCount} Items</div>
          </div>
        </div>
      </div>

      {/* LOG ENTRY FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#EAE0D5] pb-3">
          <h3 className="font-playfair text-xl font-bold text-[#7A1631]">Log Shagun / Gift Entry</h3>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Record cash envelopes, online transfers, and gift items per family relative</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Guest / Relative Name *</label>
            <input
              type="text"
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              placeholder="e.g. Sharma Chachi Ji"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Payment Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as GiftType })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
            >
              <option value="cash">Cash Envelope 💵</option>
              <option value="online">Online / UPI 📱</option>
              <option value="cheque">Bank Cheque 📝</option>
              <option value="gift">Physical Gift Item 🎁</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Date Received</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>
        </div>

        <div>
          <button
            onClick={add}
            disabled={loading}
            className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Logging..." : "+ Log Shagun Entry"}
          </button>
        </div>
      </div>

      {/* SHAGUN LEDGER TABLE */}
      <div className="luxury-card overflow-hidden">
        <div className="p-6 bg-[#FCF8F2]/60 border-b border-[#EAE0D5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7A1631] uppercase tracking-wider">Type Filter:</span>
            {(["all", "cash", "online", "cheque", "gift"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer uppercase ${
                  filterType === t
                    ? "bg-[#7A1631] text-white border-[#7A1631]"
                    : "bg-white text-[#75676B] border-[#EAE0D5]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#75676B] uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EAE0D5] bg-white text-[#1A1617]"
            >
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FCF8F2] text-[#7A1631] border-b border-[#EAE0D5] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Guest / Family Member</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Date Received</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D5]">
                {filtered.map((e) => {
                  const st = TYPE_STYLE[e.type]
                  return (
                    <tr key={e.id} className="hover:bg-[#FCF8F2]/60 transition-colors font-medium text-[#1A1617]">
                      <td className="px-6 py-3.5 font-semibold text-[#7A1631]">{e.guestName}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${st.bg} ${st.text}`}>
                          {st.emoji} {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[#75676B]">
                        {e.date ? new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-[#7A1631] font-cinzel text-sm">
                        {e.amount > 0 ? formatINR(e.amount) : "—"}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => remove(e.id)}
                          className="text-rose-600 hover:text-rose-900 font-bold text-xs cursor-pointer px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[#75676B] space-y-3">
            <div className="text-4xl">🎁</div>
            <p className="text-sm font-semibold">No Shagun entries logged yet.</p>
            <p className="text-xs">Record cash gifts and envelopes received from wedding guests above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
