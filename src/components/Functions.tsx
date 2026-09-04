import { useState } from "react"
import { WeddingFunction } from "../types"
import { inp } from "../utils"
import { eventsApi } from "../api"

interface Props {
  functions: WeddingFunction[]
  onChange: (f: WeddingFunction[]) => void
  weddingId?: string
}

const COLORS = ["#8B1D3B", "#D4900A", "#CA8A04", "#16A34A", "#7C3AED", "#0891B2", "#DC2626", "#EA580C"]

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

export default function Functions({ functions, onChange, weddingId }: Props) {
  const [editId, setEditId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Omit<WeddingFunction, "id">>({
    name: "", hindiName: "", date: "", time: "", venue: "", dresscode: "", notes: "", color: "#8B1D3B",
  })

  const update = async (id: string, patch: Partial<WeddingFunction>) => {
    const target = functions.find((f) => f.id === id)
    if (!target) return
    const updated = { ...target, ...patch }
    onChange(functions.map((f) => (f.id === id ? updated : f)))
    if (weddingId) {
      await eventsApi.update(weddingId, id, updated)
    }
  }

  const addNew = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    if (weddingId) {
      const res = await eventsApi.create(weddingId, form)
      if (res.success && res.data?.function) {
        onChange([...functions, res.data.function])
      }
    } else {
      const id = Math.random().toString(36).substring(2, 10)
      onChange([...functions, { ...form, id }])
    }
    setForm({ name: "", hindiName: "", date: "", time: "", venue: "", dresscode: "", notes: "", color: "#8B1D3B" })
    setShowAdd(false)
    setLoading(false)
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await eventsApi.delete(weddingId, id)
    }
    onChange(functions.filter((f) => f.id !== id))
  }

  const sorted = [...functions].sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">रस्में / Wedding Functions</h2>
          <p className="text-xs text-[#9B8B7A] mt-0.5">Set dates, venues, and dress codes for each ceremony</p>
        </div>
        <button
          onClick={() => setShowAdd((p) => !p)}
          className="bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          + Add Function
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-5 shadow-sm">
          <h3 className="font-playfair font-bold text-[#8B1D3B] mb-4">New Function</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Tilak" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Hindi Name</label>
              <input type="text" value={form.hindiName} onChange={(e) => setForm((p) => ({ ...p, hindiName: e.target.value }))} placeholder="e.g. तिलक" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Venue</label>
              <input type="text" value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Venue name" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Dress Code</label>
              <input type="text" value={form.dresscode} onChange={(e) => setForm((p) => ({ ...p, dresscode: e.target.value }))} placeholder="e.g. Yellow / Ethnic" className={inp} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Any notes..." className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Color</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{ background: c, borderColor: form.color === c ? "#2C1810" : "transparent" }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addNew} disabled={!form.name.trim() || loading} className="bg-[#8B1D3B] hover:bg-[#6B1530] disabled:opacity-40 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors">
              {loading ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setShowAdd(false)} className="bg-[#F0E6D3] hover:bg-[#E8D5B7] text-[#6B5744] font-medium px-5 py-2 rounded-lg text-sm transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Function cards */}
      <div className="space-y-4">
        {sorted.map((fn) => {
          const days = daysUntil(fn.date)
          const isEditing = editId === fn.id
          return (
            <div key={fn.id} className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden hover:border-[#D4900A]/50 transition-colors shadow-sm">
              <div className="flex items-stretch">
                {/* Color bar */}
                <div className="w-1.5 flex-shrink-0" style={{ background: fn.color }} />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-playfair font-bold text-[#2C1810] text-lg leading-tight">
                          {fn.name}
                        </div>
                        <div className="text-xs text-[#9B8B7A]">{fn.hindiName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {days !== null && (
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: days < 0 ? "#F0FDF4" : days <= 7 ? "#FEF2F2" : "#FEF0D7",
                            color: days < 0 ? "#166534" : days <= 7 ? "#B91C1C" : "#D4900A",
                          }}
                        >
                          {days < 0 ? "Completed" : days === 0 ? "Today!" : `${days} days`}
                        </span>
                      )}
                      <button
                        onClick={() => setEditId(isEditing ? null : fn.id)}
                        className="text-xs text-[#9B8B7A] hover:text-[#8B1D3B] px-2 py-1 rounded transition-colors font-medium"
                      >
                        {isEditing ? "Done" : "Edit"}
                      </button>
                      <button onClick={() => remove(fn.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none">×</button>
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6B5744]">
                      {fn.date && (
                        <span className="flex items-center gap-1">
                          📅 {new Date(fn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {fn.time && ` at ${fn.time}`}
                        </span>
                      )}
                      {fn.venue && <span className="flex items-center gap-1">📍 {fn.venue}</span>}
                      {fn.dresscode && <span className="flex items-center gap-1">👗 {fn.dresscode}</span>}
                      {fn.notes && <span className="text-[#9B8B7A] italic">{fn.notes}</span>}
                      {!fn.date && !fn.venue && !fn.dresscode && (
                        <span className="text-[#C4A882] italic">Click Edit to set date, venue & dress code</span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Date</label>
                        <input type="date" value={fn.date} onChange={(e) => update(fn.id, { date: e.target.value })} className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Time</label>
                        <input type="time" value={fn.time} onChange={(e) => update(fn.id, { time: e.target.value })} className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Venue</label>
                        <input type="text" value={fn.venue} onChange={(e) => update(fn.id, { venue: e.target.value })} placeholder="Venue name" className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Dress Code</label>
                        <input type="text" value={fn.dresscode} onChange={(e) => update(fn.id, { dresscode: e.target.value })} placeholder="e.g. Yellow / Ethnic" className={inp} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Notes</label>
                        <input type="text" value={fn.notes} onChange={(e) => update(fn.id, { notes: e.target.value })} placeholder="Any notes..." className={inp} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6B5744] mb-1">Color</label>
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          {COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => update(fn.id, { color: c })}
                              className="w-6 h-6 rounded-full border-2 transition-all"
                              style={{ background: c, borderColor: fn.color === c ? "#2C1810" : "transparent" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {functions.length === 0 && (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-sm font-medium">No functions added yet.</p>
          <p className="text-xs mt-1">Add your wedding ceremonies above.</p>
        </div>
      )}
    </div>
  )
}
