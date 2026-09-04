import { useState } from "react"
import { ShagunEntry, GiftType } from "../types"
import { formatINR, formatINRFull, inp, btnPrimary } from "../utils"
import { shagunApi } from "../api"

interface Props {
  entries: ShagunEntry[]
  onChange: (e: ShagunEntry[]) => void
  weddingId?: string
}

const TYPE_STYLE: Record<GiftType, { label: string; bg: string; text: string; emoji: string }> = {
  cash: { label: "Cash", bg: "#DCFCE7", text: "#166534", emoji: "💵" },
  cheque: { label: "Cheque", bg: "#DBEAFE", text: "#1D4ED8", emoji: "📝" },
  online: { label: "Online", bg: "#EDE9FE", text: "#6D28D9", emoji: "📱" },
  gift: { label: "Gift", bg: "#FEF0D7", text: "#92400E", emoji: "🎁" },
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
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden shadow-sm">
        <div
          style={{ background: "linear-gradient(135deg, #8B1D3B 0%, #5A1228 100%)" }}
          className="px-6 py-5 text-white"
        >
          <p className="text-[#F5C6C6] text-xs font-medium uppercase tracking-widest mb-1">Total Received</p>
          <div className="font-playfair text-4xl font-bold" style={{ color: "#D4900A" }}>
            {formatINRFull(total)}
          </div>
          <p style={{ color: "#F5C6C6" }} className="text-xs mt-1">{entries.length} entries</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#F0E6D3]">
          {[
            { label: "Cash", value: formatINR(cashTotal), emoji: "💵" },
            { label: "Online", value: formatINR(onlineTotal), emoji: "📱" },
            { label: "Cheque", value: formatINR(chequeTotal), emoji: "📝" },
            { label: "Gifts", value: `${giftCount} items`, emoji: "🎁" },
          ].map((s) => (
            <div key={s.label} className="px-5 py-3 text-center">
              <div className="text-lg mb-0.5">{s.emoji}</div>
              <div className="font-semibold text-sm text-[#2C1810]">{s.value}</div>
              <div className="text-xs text-[#9B8B7A]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add entry */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-6">
        <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-1">शगुन जोड़ें</h2>
        <p className="text-xs text-[#9B8B7A] mb-5">Log Shagun / Gift received</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Guest Name *</label>
            <input
              type="text"
              value={form.guestName}
              onChange={(e) => setForm((p) => ({ ...p, guestName: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Who gave the gift?"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as GiftType }))} className={inp}>
              {Object.entries(TYPE_STYLE).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">
              Amount ₹ {form.type === "gift" ? "(optional)" : ""}
            </label>
            <input
              type="number"
              min="0"
              value={form.amount || ""}
              onChange={(e) => setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inp} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Description (optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="e.g. Gold necklace, envelope"
              className={inp}
            />
          </div>
        </div>
        <button onClick={add} disabled={!form.guestName.trim() || loading} className={btnPrimary + " mt-4"}>
          {loading ? "Logging..." : "+ Log Gift"}
        </button>
      </div>

      {/* Filters */}
      {entries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setFilterType("all")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === "all" ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>All</button>
          {(Object.keys(TYPE_STYLE) as GiftType[]).map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === t ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>
              {TYPE_STYLE[t].emoji} {TYPE_STYLE[t].label}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="ml-auto border border-[#E8D5B7] rounded-lg px-2 py-1 text-xs bg-[#FFFBF5] text-[#6B5744] focus:outline-none"
          >
            <option value="date">Sort: Latest first</option>
            <option value="amount">Sort: Highest amount</option>
          </select>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] divide-y divide-[#F0E6D3] overflow-hidden">
          {filtered.map((entry) => {
            const ts = TYPE_STYLE[entry.type] || TYPE_STYLE.cash
            return (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-4 hover:bg-[#FFFBF5] transition-colors">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{ background: ts.bg }}>
                  {ts.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#2C1810]">{entry.guestName}</div>
                  <div className="text-xs text-[#9B8B7A] flex items-center gap-2">
                    <span style={{ color: ts.text }} className="font-medium">{ts.label}</span>
                    {entry.date && <span>· {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                    {entry.description && <span>· {entry.description}</span>}
                  </div>
                </div>
                {entry.amount > 0 && (
                  <div className="font-mono font-bold text-[#8B1D3B] text-sm flex-shrink-0">
                    {formatINR(entry.amount)}
                  </div>
                )}
                <button onClick={() => remove(entry.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none flex-shrink-0">×</button>
              </div>
            )
          })}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-sm font-medium">No shagun logged yet.</p>
          <p className="text-xs mt-1">Track all gifts and cash received from guests.</p>
        </div>
      ) : null}
    </div>
  )
}
