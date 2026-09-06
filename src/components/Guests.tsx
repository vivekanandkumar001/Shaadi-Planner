import { useState } from "react"
import { Guest, Side, RSVP, MealPref, TableData } from "../types"
import { guestsApi } from "../api"

interface Props {
  guests: Guest[]
  tables: TableData[]
  onChange: (g: Guest[]) => void
  weddingId?: string
}

type Filter = "all" | Side

const blank: Omit<Guest, "id"> = {
  name: "", side: "common", rsvp: "pending", meal: "veg", plusOnes: 0, tableId: null, phone: "",
}

export default function Guests({ guests, tables, onChange, weddingId }: Props) {
  const [form, setForm] = useState<Omit<Guest, "id">>(blank)
  const [filter, setFilter] = useState<Filter>("all")
  const [sortBy, setSortBy] = useState<"name" | "rsvp" | "side">("name")
  const [loading, setLoading] = useState(false)

  const confirmed = guests.filter((g) => g.rsvp === "confirmed").length
  const headcount = guests.reduce((s, g) => s + 1 + g.plusOnes, 0)
  const vegCount = guests.filter((g) => g.meal === "veg").length
  const nonVegCount = guests.filter((g) => g.meal === "nonveg").length
  const jainCount = guests.filter((g) => g.meal === "jain").length

  const add = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    if (weddingId) {
      const res = await guestsApi.create(weddingId, form)
      if (res.success && res.data?.guest) {
        onChange([...guests, res.data.guest])
      }
    } else {
      onChange([...guests, { ...form, id: Math.random().toString(36).substring(2, 9) }])
    }
    setForm(blank)
    setLoading(false)
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await guestsApi.delete(weddingId, id)
    }
    onChange(guests.filter((g) => g.id !== id))
  }

  const updateRsvp = async (id: string, rsvp: RSVP) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, rsvp } : g))
    onChange(updated)
    if (weddingId) {
      const target = guests.find((g) => g.id === id)
      if (target) {
        await guestsApi.update(weddingId, id, { ...target, rsvp })
      }
    }
  }

  const updateTable = async (id: string, tableId: string | null) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, tableId } : g))
    onChange(updated)
    if (weddingId) {
      const target = guests.find((g) => g.id === id)
      if (target) {
        await guestsApi.update(weddingId, id, { ...target, tableId })
      }
    }
  }

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
    <div className="space-y-8 animate-fade-in-up">
      {/* SUMMARY METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-[#7A1631]">{guests.length}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Invitations</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-emerald-600">
            {confirmed} <span className="text-xs text-[#75676B] font-normal">({guests.length ? Math.round((confirmed / guests.length) * 100) : 0}%)</span>
          </div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Confirmed RSVPs</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-[#D4AF37]">{headcount}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Headcount</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-xl font-bold text-[#1A1617]">
            🥦{vegCount} • 🍗{nonVegCount} • 🧅{jainCount}
          </div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Dietary Preferences</div>
        </div>
      </div>

      {/* ADD GUEST FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#EAE0D5] pb-4">
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Add New Guest Entry</h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Register guests, side, RSVP status, dietary preferences, and plus-ones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Guest Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ramesh Uncle"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Wedding Side *</label>
            <select
              value={form.side}
              onChange={(e) => setForm({ ...form, side: e.target.value as Side })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all cursor-pointer"
            >
              <option value="bride">Bride Side (दुल्हन पक्ष)</option>
              <option value="groom">Groom Side (दूल्हा पक्ष)</option>
              <option value="common">Common / Mutual Friend</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Meal Preference *</label>
            <select
              value={form.meal}
              onChange={(e) => setForm({ ...form, meal: e.target.value as MealPref })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all cursor-pointer"
            >
              <option value="veg">Vegetarian 🥦</option>
              <option value="nonveg">Non-Vegetarian 🍗</option>
              <option value="jain">Jain Pure Veg 🧅</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Plus-Ones Count</label>
            <input
              type="number"
              min="0"
              max="10"
              value={form.plusOnes}
              onChange={(e) => setForm({ ...form, plusOnes: parseInt(e.target.value) || 0 })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={add}
            disabled={loading}
            className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving Guest..." : "+ Add Guest to List"}
          </button>
        </div>
      </div>

      {/* DIRECTORY TABLE & FILTERS */}
      <div className="luxury-card overflow-hidden space-y-0">
        <div className="p-6 bg-[#FCF8F2]/60 border-b border-[#EAE0D5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7A1631] uppercase tracking-wider">Filter Side:</span>
            {(["all", "bride", "groom", "common"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer uppercase ${
                  filter === f
                    ? "bg-[#7A1631] text-white border-[#7A1631] shadow-sm"
                    : "bg-white text-[#75676B] border-[#EAE0D5] hover:bg-[#FCF8F2]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#75676B] uppercase tracking-wider">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EAE0D5] bg-white text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            >
              <option value="name">Name (Alphabetical)</option>
              <option value="rsvp">RSVP Status</option>
              <option value="side">Side</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FCF8F2] text-[#7A1631] border-b border-[#EAE0D5] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Guest Name</th>
                  <th className="px-6 py-3.5">Side</th>
                  <th className="px-6 py-3.5">RSVP Status</th>
                  <th className="px-6 py-3.5">Meal</th>
                  <th className="px-6 py-3.5">Headcount</th>
                  <th className="px-6 py-3.5">Table Assignment</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D5]">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FCF8F2]/60 transition-colors font-medium text-[#1A1617]">
                    <td className="px-6 py-3.5 font-semibold text-[#7A1631]">{g.name}</td>
                    <td className="px-6 py-3.5 capitalize">{g.side}</td>
                    <td className="px-6 py-3.5">
                      <select
                        value={g.rsvp}
                        onChange={(e) => updateRsvp(g.id, e.target.value as RSVP)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          g.rsvp === "confirmed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : g.rsvp === "declined"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="confirmed">✓ Confirmed</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="declined">✕ Declined</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 uppercase font-semibold text-[#75676B]">
                      {g.meal === "veg" ? "🥦 Veg" : g.meal === "nonveg" ? "🍗 Non-Veg" : "🧅 Jain"}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-[#7A1631]">
                      1 {g.plusOnes > 0 ? `+ ${g.plusOnes}` : ""}
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={g.tableId || ""}
                        onChange={(e) => updateTable(g.id, e.target.value || null)}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-[#EAE0D5] bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
                      >
                        <option value="">Unassigned</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.capacity} Max)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => remove(g.id)}
                        className="text-rose-600 hover:text-rose-900 font-bold text-xs cursor-pointer px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[#75676B] space-y-3">
            <div className="text-4xl">👥</div>
            <p className="text-sm font-semibold">No guest entries found matching the filter criteria.</p>
            <p className="text-xs">Add your first guest above to begin tracking RSVPs and seating.</p>
          </div>
        )}
      </div>
    </div>
  )
}
