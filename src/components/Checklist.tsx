import { useState } from "react"
import { ChecklistItem, ChecklistCategory, ChecklistPriority } from "../types"
import { generateId, inp, btnPrimary } from "../utils"

interface Props {
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
}

const CAT_LABELS: Record<ChecklistCategory, string> = {
  venue: "🏛️ Venue", catering: "🍽️ Catering", outfits: "👗 Outfits",
  decor: "🌸 Decor", invites: "💌 Invitations", beauty: "💄 Beauty",
  legal: "📜 Legal", honeymoon: "✈️ Honeymoon", other: "✦ Other",
}

const PRIORITY_STYLE: Record<ChecklistPriority, { bg: string; text: string }> = {
  high: { bg: "#FEF2F2", text: "#B91C1C" },
  medium: { bg: "#FEF0D7", text: "#92400E" },
  low: { bg: "#F0F9FF", text: "#0369A1" },
}

const blank: Omit<ChecklistItem, "id"> = {
  task: "", category: "other", priority: "medium", dueDate: "", done: false,
}

export default function Checklist({ items, onChange }: Props) {
  const [form, setForm] = useState<Omit<ChecklistItem, "id">>(blank)
  const [catFilter, setCatFilter] = useState<ChecklistCategory | "all">("all")
  const [showDone, setShowDone] = useState(false)

  const done = items.filter((i) => i.done).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  const add = () => {
    if (!form.task.trim()) return
    onChange([...items, { ...form, id: generateId() }])
    setForm(blank)
  }

  const toggle = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id))

  const usedCats = Array.from(new Set(items.map((i) => i.category)))

  const filtered = items
    .filter((i) => (catFilter === "all" || i.category === catFilter))
    .filter((i) => showDone || !i.done)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      const po: Record<ChecklistPriority, number> = { high: 0, medium: 1, low: 2 }
      return po[a.priority] - po[b.priority]
    })

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-playfair text-2xl font-bold text-[#8B1D3B]">{done}</span>
            <span className="text-[#9B8B7A] text-sm"> / {items.length} tasks complete</span>
          </div>
          <span className="font-mono font-bold text-[#D4900A]">{pct}%</span>
        </div>
        <div className="w-full bg-[#F0E6D3] rounded-full h-2.5">
          <div
            className="bg-[#8B1D3B] h-2.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(CAT_LABELS).map(([key, label]) => {
            const catItems = items.filter((i) => i.category === key)
            if (catItems.length === 0) return null
            const catDone = catItems.filter((i) => i.done).length
            return (
              <div key={key} className="text-xs text-[#6B5744]">
                <span>{label}</span>
                <span className="ml-1 font-semibold text-[#8B1D3B]">{catDone}/{catItems.length}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add task */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-5">
        <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-4">
          कार्य जोड़ें / Add Task
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Task</label>
            <input
              type="text"
              value={form.task}
              onChange={(e) => setForm((p) => ({ ...p, task: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="What needs to be done?"
              className={inp}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as ChecklistCategory }))} className={inp}>
              {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as ChecklistPriority }))} className={inp}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🔵 Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className={inp} />
          </div>
        </div>
        <button onClick={add} disabled={!form.task.trim()} className={btnPrimary + " mt-4"}>+ Add Task</button>
      </div>

      {/* Filters */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setCatFilter("all")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${catFilter === "all" ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>All</button>
          {usedCats.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${catFilter === c ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>
              {CAT_LABELS[c]}
            </button>
          ))}
          <label className="flex items-center gap-1.5 ml-auto text-xs text-[#6B5744] cursor-pointer">
            <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="accent-[#8B1D3B]" />
            Show completed
          </label>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] divide-y divide-[#F0E6D3] overflow-hidden">
          {filtered.map((item) => {
            const ps = PRIORITY_STYLE[item.priority]
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#FFFBF5] ${item.done ? "opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggle(item.id)}
                  className="w-4 h-4 rounded accent-[#8B1D3B] flex-shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium text-[#2C1810] ${item.done ? "line-through" : ""}`}>
                    {item.task}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#9B8B7A]">{CAT_LABELS[item.category]}</span>
                    {item.dueDate && (
                      <span className="text-[10px] text-[#9B8B7A]">
                        · Due {new Date(item.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: ps.bg, color: ps.text }}>
                  {item.priority}
                </span>
                <button onClick={() => remove(item.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none flex-shrink-0">×</button>
              </div>
            )
          })}
        </div>
      ) : items.length > 0 ? (
        <div className="text-center py-12 text-[#C4A882]">
          <p className="text-sm">{showDone ? "No tasks in this category" : "All tasks complete! 🎉"}</p>
        </div>
      ) : (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-sm font-medium">No tasks yet.</p>
          <p className="text-xs mt-1">Add your wedding to-do items above.</p>
        </div>
      )}
    </div>
  )
}
