import { useState } from "react"
import { Guest, Side, RSVP, MealPref, TableData } from "../types"
import { generateId, inp, btnPrimary } from "../utils"

interface Props {
  guests: Guest[]
  tables: TableData[]
  onChange: (g: Guest[]) => void
}

type Filter = "all" | Side

const blank: Omit<Guest, "id"> = {
  name: "", side: "common", rsvp: "pending", meal: "veg", plusOnes: 0, tableId: null, phone: "",
}

export default function Guests({ guests, tables, onChange }: Props) {
  const [form, setForm] = useState<Omit<Guest, "id">>(blank)
  const [filter, setFilter] = useState<Filter>("all")
  const [sortBy, setSortBy] = useState<"name" | "rsvp" | "side">("name")

  const confirmed = guests.filter((g) => g.rsvp === "confirmed").length
  const headcount = guests.reduce((s, g) => s + 1 + g.plusOnes, 0)
  const vegCount = guests.filter((g) => g.meal === "veg").length
  const nonVegCount = guests.filter((g) => g.meal === "nonveg").length
  const jainCount = guests.filter((g) => g.meal === "jain").length

  const add = () => {
    if (!form.name.trim()) return
    onChange([...guests, { ...form, id: generateId() }])
    setForm(blank)
  }

  const remove = (id: string) => onChange(guests.filter((g) => g.id !== id))

  const updateRsvp = (id: string, rsvp: RSVP) =>
    onChange(guests.map((g) => (g.id === id ? { ...g, rsvp } : g)))

  const updateTable = (id: string, tableId: string | null) =>
    onChange(guests.map((g) => (g.id === id ? { ...g, tableId } : g)))

  const filtered = guests
    .filter((g) => filter === "all" || g.side === filter)
    .sort((a, b) => {
      if (sortBy === "rsvp") {
        const o: Record<RSVP, number> = { confirmed: 0, pending: 1, declined: 2 }
        return o[a.rsvp] - o[b.rsvp]
      }
      if (sortBy === "side") return a.side.localeCompare(b.side)
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", sub: "guests added", value: guests.length, color: "#8B1D3B" },
          { label: "Confirmed", sub: `${guests.length ? Math.round((confirmed / guests.length) * 100) : 0}% rate`, value: confirmed, color: "#166534" },
          { label: "Headcount", sub: "incl. plus-ones", value: headcount, color: "#D4900A" },
          { label: "Unassigned", sub: "no table yet", value: guests.filter((g) => !g.tableId).length, color: "#9B8B7A" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8D5B7] p-4">
            <div className="font-playfair text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold text-[#2C1810] mt-1">{s.label}</div>
            <div className="text-[10px] text-[#9B8B7A]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Meal summary */}
      {guests.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8D5B7] px-5 py-4 flex flex-wrap gap-6">
          <div className="text-xs font-medium text-[#6B5744] self-center">Meal Preferences:</div>
          {[
            { label: "Veg", count: vegCount, dot: "#16A34A" },
            { label: "Non-Veg", count: nonVegCount, dot: "#DC2626" },
            { label: "Jain", count: jainCount, dot: "#2563EB" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.dot }} />
              <span className="text-sm font-semibold text-[#2C1810]">{m.count}</span>
              <span className="text-xs text-[#9B8B7A]">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add guest */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-6">
        <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-1">मेहमान जोड़ें</h2>
        <p className="text-xs text-[#9B8B7A] mb-5">Add Guest</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Name (नाम)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Guest name"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Optional"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Side (पक्ष)</label>
            <select value={form.side} onChange={(e) => setForm((p) => ({ ...p, side: e.target.value as Side }))} className={inp}>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
              <option value="common">Common</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Meal (खाना)</label>
            <select value={form.meal} onChange={(e) => setForm((p) => ({ ...p, meal: e.target.value as MealPref }))} className={inp}>
              <option value="veg">🟢 Veg</option>
              <option value="nonveg">🔴 Non-Veg</option>
              <option value="jain">🔵 Jain</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">+1s</label>
            <input
              type="number"
              min="0"
              max="10"
              value={form.plusOnes}
              onChange={(e) => setForm((p) => ({ ...p, plusOnes: parseInt(e.target.value) || 0 }))}
              className={inp}
            />
          </div>
        </div>
        <button onClick={add} disabled={!form.name.trim()} className={btnPrimary + " mt-4"}>
          + Add Guest
        </button>
      </div>

      {/* List */}
      {guests.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8D5B7] flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-playfair text-lg font-bold text-[#8B1D3B]">
              Guest List ({filtered.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {(["all", "bride", "groom", "common"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-[#E8D5B7] rounded-lg px-2 py-1 text-xs bg-[#FFFBF5] text-[#6B5744] focus:outline-none"
              >
                <option value="name">Sort: Name</option>
                <option value="rsvp">Sort: RSVP</option>
                <option value="side">Sort: Side</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FEF0D7] text-[#6B5744] border-b border-[#E8D5B7]">
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Side</th>
                  <th className="text-left px-5 py-3 font-medium">RSVP</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Meal</th>
                  <th className="text-center px-5 py-3 font-medium hidden sm:table-cell">+1s</th>
                  <th className="text-left px-5 py-3 font-medium">Table</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id} className={`border-t border-[#F0E6D3] hover:bg-[#FFFBF5] transition-colors ${i % 2 ? "bg-[#FFFBF5]" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="font-medium text-[#2C1810]">{g.name}</div>
                      {g.phone && <div className="text-xs text-[#9B8B7A]">{g.phone}</div>}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.side === "bride" ? "bg-pink-100 text-pink-700" : g.side === "groom" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                        {g.side.charAt(0).toUpperCase() + g.side.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={g.rsvp}
                        onChange={(e) => updateRsvp(g.id, e.target.value as RSVP)}
                        className={`text-xs px-2 py-1 rounded-full border font-medium cursor-pointer focus:outline-none ${g.rsvp === "confirmed" ? "bg-green-50 border-green-200 text-green-700" : g.rsvp === "declined" ? "bg-red-50 border-red-200 text-red-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-[#6B5744] hidden md:table-cell">
                      {g.meal === "veg" ? "🟢 Veg" : g.meal === "nonveg" ? "🔴 Non-Veg" : "🔵 Jain"}
                    </td>
                    <td className="px-5 py-3 text-center text-[#9B8B7A] hidden sm:table-cell">{g.plusOnes || "—"}</td>
                    <td className="px-5 py-3">
                      <select
                        value={g.tableId || ""}
                        onChange={(e) => updateTable(g.id, e.target.value || null)}
                        className="border border-[#E8D5B7] rounded-lg px-2 py-1 text-xs bg-[#FFFBF5] text-[#6B5744] focus:outline-none max-w-[110px]"
                      >
                        <option value="">Unassigned</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(g.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-sm font-medium">No guests yet. Start adding your baraat!</p>
        </div>
      )}
    </div>
  )
}
