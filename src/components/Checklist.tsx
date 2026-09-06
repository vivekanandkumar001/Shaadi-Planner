import { useState } from "react"
import { ChecklistItem, ChecklistCategory, ChecklistPriority } from "../types"
import { tasksApi } from "../api"

interface Props {
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
  weddingId?: string
}

const CAT_LABELS: Record<ChecklistCategory, string> = {
  venue: "🏛️ Venue & Location", catering: "🍽️ Catering & Food", outfits: "👗 Outfits & Attire",
  decor: "🌸 Decor & Flowers", invites: "💌 Invitations & Cards", beauty: "💄 Beauty & Makeup",
  legal: "📜 Marriage Registration", honeymoon: "✈️ Honeymoon & Travel", other: "✦ Other Checklist",
}

const blank: Omit<ChecklistItem, "id"> = {
  task: "", category: "other", priority: "medium", dueDate: "", done: false,
}

export default function Checklist({ items, onChange, weddingId }: Props) {
  const [form, setForm] = useState<Omit<ChecklistItem, "id">>(blank)
  const [catFilter, setCatFilter] = useState<ChecklistCategory | "all">("all")
  const [showDone, setShowDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const done = items.filter((i) => i.done).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  const add = async () => {
    if (!form.task.trim()) return
    setLoading(true)
    if (weddingId) {
      const res = await tasksApi.create(weddingId, form)
      if (res.success && res.data?.task) {
        onChange([...items, res.data.task])
      }
    } else {
      onChange([...items, { ...form, id: Math.random().toString(36).substring(2, 9) }])
    }
    setForm(blank)
    setLoading(false)
  }

  const toggle = async (id: string) => {
    const updated = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    onChange(updated)
    if (weddingId) {
      await tasksApi.toggle(weddingId, id)
    }
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await tasksApi.delete(weddingId, id)
    }
    onChange(items.filter((i) => i.id !== id))
  }

  const filtered = items
    .filter((i) => (catFilter === "all" || i.category === catFilter))
    .filter((i) => showDone || !i.done)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      const po: Record<ChecklistPriority, number> = { high: 0, medium: 1, low: 2 }
      return po[a.priority] - po[b.priority]
    })

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* OVERALL PROGRESS */}
      <div className="luxury-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Wedding Planning Checklist</h2>
            <p className="text-xs text-[#75676B] font-medium mt-0.5">Categorized timeline and priority tracking for essential ceremonies</p>
          </div>
          <div className="text-right">
            <span className="font-cinzel text-3xl font-extrabold gold-gradient-text">{pct}%</span>
            <div className="text-xs text-[#75676B] font-semibold">{done} of {items.length} Completed</div>
          </div>
        </div>

        <div className="w-full bg-[#EAE0D5] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#7A1631] via-[#D4AF37] to-[#10B981] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ADD TASK FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#EAE0D5] pb-3">
          <h3 className="font-playfair text-lg font-bold text-[#7A1631]">Add New Checklist Task</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          <div className="lg:col-span-2">
            <label className="block text-[#1A1617] font-semibold mb-1.5">Task Description *</label>
            <input
              type="text"
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              placeholder="e.g. Finalize bridal makeup artist booking"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ChecklistCategory })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
            >
              {Object.entries(CAT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Priority *</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as ChecklistPriority })}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
            >
              <option value="high">High Priority 🔴</option>
              <option value="medium">Medium Priority 🟡</option>
              <option value="low">Low Priority 🟢</option>
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={add}
            disabled={loading}
            className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Adding..." : "+ Add Task to Checklist"}
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS & TASK LIST */}
      <div className="luxury-card overflow-hidden">
        <div className="p-6 bg-[#FCF8F2]/60 border-b border-[#EAE0D5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setCatFilter("all")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer uppercase ${
                catFilter === "all"
                  ? "bg-[#7A1631] text-white border-[#7A1631]"
                  : "bg-white text-[#75676B] border-[#EAE0D5]"
              }`}
            >
              All Categories
            </button>
            {Object.entries(CAT_LABELS).map(([k, v]) => {
              const count = items.filter((i) => i.category === k).length
              if (count === 0) return null
              return (
                <button
                  key={k}
                  onClick={() => setCatFilter(k as ChecklistCategory)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer uppercase ${
                    catFilter === k
                      ? "bg-[#7A1631] text-white border-[#7A1631]"
                      : "bg-white text-[#75676B] border-[#EAE0D5]"
                  }`}
                >
                  {v} ({count})
                </button>
              )
            })}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1617] cursor-pointer">
            <input
              type="checkbox"
              checked={showDone}
              onChange={(e) => setShowDone(e.target.checked)}
              className="rounded text-[#7A1631] focus:ring-[#7A1631]"
            />
            <span>Show Completed Tasks</span>
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-[#EAE0D5]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`px-6 py-4 flex items-center justify-between gap-4 transition-colors ${
                  item.done ? "bg-[#FCF8F2]/30 opacity-60" : "hover:bg-[#FCF8F2]/60"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggle(item.id)}
                    className="w-5 h-5 rounded text-[#7A1631] focus:ring-[#7A1631] cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-semibold ${item.done ? "line-through text-[#75676B]" : "text-[#1A1617]"}`}>
                      {item.task}
                    </div>
                    <div className="text-[10px] text-[#75676B] uppercase font-bold tracking-wider mt-0.5">
                      {CAT_LABELS[item.category]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      item.priority === "high"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : item.priority === "medium"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-rose-600 hover:text-rose-900 font-bold text-xs cursor-pointer px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#75676B] space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-sm font-semibold">No checklist items match the current filters.</p>
            <p className="text-xs">Add your wedding tasks above to start checking off items.</p>
          </div>
        )}
      </div>
    </div>
  )
}
