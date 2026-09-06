import { useState } from "react"
import { WeddingFunction } from "../types"
import { eventsApi } from "../api"

interface Props {
  functions: WeddingFunction[]
  onChange: (f: WeddingFunction[]) => void
  weddingId?: string
}

const COLORS = ["#7A1631", "#D4AF37", "#CA8A04", "#10B981", "#8B5CF6", "#0891B2", "#EF4444", "#F97316"]

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
    name: "", hindiName: "", date: "", time: "", venue: "", dresscode: "", notes: "", color: "#7A1631",
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
    setForm({ name: "", hindiName: "", date: "", time: "", venue: "", dresscode: "", notes: "", color: "#7A1631" })
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
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EAE0D5] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Ceremonial Functions & Itinerary</h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Schedule dates, venues, timings, and dress codes for all wedding rituals</p>
        </div>
        <button
          onClick={() => setShowAdd((p) => !p)}
          className="luxury-button-primary font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
        >
          {showAdd ? "✕ Close Form" : "+ Add Function"}
        </button>
      </div>

      {/* ADD FORM */}
      {showAdd && (
        <div className="luxury-card p-6 sm:p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#7A1631]">Configure New Ceremonial Function</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Function Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sangeet & Cocktails"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Hindi Name</label>
              <input
                type="text"
                value={form.hindiName}
                onChange={(e) => setForm((p) => ({ ...p, hindiName: e.target.value }))}
                placeholder="e.g. संगीत एवं संध्या"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Timing</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                placeholder="e.g. 7:00 PM Onwards"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Venue Location</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
                placeholder="e.g. Palace Courtyard"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Dress Code</label>
              <input
                type="text"
                value={form.dresscode}
                onChange={(e) => setForm((p) => ({ ...p, dresscode: e.target.value }))}
                placeholder="e.g. Indo-Western Royal"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#1A1617] font-semibold mb-1.5">Theme Color Badge</label>
              <div className="flex items-center gap-2 pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      form.color === c ? "scale-110 border-[#1A1617] shadow-md" : "border-white"
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={addNew}
              disabled={loading}
              className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Saving..." : "Save Ceremony"}
            </button>
          </div>
        </div>
      )}

      {/* FUNCTIONS CARD GRID */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((fn) => {
            const d = daysUntil(fn.date)
            const isEditing = editId === fn.id

            return (
              <div key={fn.id} className="luxury-card p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: fn.color || "#7A1631" }} />

                <div className="space-y-3 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-[#7A1631]">{fn.name}</h3>
                      {fn.hindiName && <span className="text-xs text-[#75676B] font-medium">{fn.hindiName}</span>}
                    </div>
                    {d !== null && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                          d <= 7 ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-[#FCF8F2] border-[#EAE0D5] text-[#7A1631]"
                        }`}
                      >
                        {d === 0 ? "Today" : d < 0 ? "Finished" : `${d} Days`}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 text-xs pt-2">
                      <input
                        type="text"
                        value={fn.name}
                        onChange={(e) => update(fn.id, { name: e.target.value })}
                        className="w-full border border-[#EAE0D5] rounded-lg p-2 bg-[#FCF8F2]"
                      />
                      <input
                        type="date"
                        value={fn.date}
                        onChange={(e) => update(fn.id, { date: e.target.value })}
                        className="w-full border border-[#EAE0D5] rounded-lg p-2 bg-[#FCF8F2]"
                      />
                      <input
                        type="text"
                        value={fn.venue}
                        onChange={(e) => update(fn.id, { venue: e.target.value })}
                        placeholder="Venue"
                        className="w-full border border-[#EAE0D5] rounded-lg p-2 bg-[#FCF8F2]"
                      />
                      <button
                        onClick={() => setEditId(null)}
                        className="w-full bg-[#7A1631] text-white rounded-lg py-1.5 font-bold"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-[#1A1617] font-medium">
                      {fn.date && (
                        <div className="flex items-center gap-2 text-[#7A1631] font-semibold">
                          <span>📅</span>
                          <span>
                            {new Date(fn.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      {fn.time && (
                        <div className="flex items-center gap-2 text-[#75676B]">
                          <span>⏰</span> <span>{fn.time}</span>
                        </div>
                      )}
                      {fn.venue && (
                        <div className="flex items-center gap-2 text-[#75676B]">
                          <span>📍</span> <span>{fn.venue}</span>
                        </div>
                      )}
                      {fn.dresscode && (
                        <div className="flex items-center gap-2 text-[#75676B]">
                          <span>👗</span> <span>Dress code: {fn.dresscode}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => setEditId(fn.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#EAE0D5] text-[#7A1631] font-semibold hover:bg-[#FCF8F2] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(fn.id)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 font-semibold bg-rose-50 hover:bg-rose-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="luxury-card p-12 text-center text-[#75676B] space-y-3">
          <div className="text-4xl">📅</div>
          <p className="text-sm font-semibold">No ceremonial functions configured yet.</p>
          <p className="text-xs">Add Haldi, Mehendi, Sangeet, Vivah, and Reception details above.</p>
        </div>
      )}
    </div>
  )
}
