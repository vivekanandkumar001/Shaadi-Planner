import { useState } from "react"
import { Note } from "../types"
import { generateId } from "../utils"

interface Props {
  notes: Note[]
  onChange: (n: Note[]) => void
}

const COLORS = [
  { bg: "#FFFBF5", border: "#E8D5B7", label: "Cream" },
  { bg: "#FEF0D7", border: "#D4900A", label: "Marigold" },
  { bg: "#FEF2F2", border: "#FCA5A5", label: "Rose" },
  { bg: "#F0FDF4", border: "#86EFAC", label: "Mint" },
  { bg: "#EFF6FF", border: "#93C5FD", label: "Sky" },
  { bg: "#FDF4FF", border: "#D8B4FE", label: "Lavender" },
  { bg: "#FFFBEB", border: "#FCD34D", label: "Saffron" },
]

const blank = { title: "", content: "", color: "#FFFBF5" }

export default function Notes({ notes, onChange }: Props) {
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const add = () => {
    if (!form.title.trim() && !form.content.trim()) return
    onChange([
      { id: generateId(), title: form.title, content: form.content, color: form.color, createdAt: new Date().toISOString() },
      ...notes,
    ])
    setForm(blank)
  }

  const remove = (id: string) => onChange(notes.filter((n) => n.id !== id))

  const startEdit = (n: Note) => { setEditId(n.id); setEditContent(n.content) }

  const saveEdit = (id: string) => {
    onChange(notes.map((n) => (n.id === id ? { ...n, content: editContent } : n)))
    setEditId(null)
  }

  const updateColor = (id: string, color: string) =>
    onChange(notes.map((n) => (n.id === id ? { ...n, color } : n)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">नोट्स / Notes</h2>
          <p className="text-xs text-[#9B8B7A] mt-0.5">Ideas, inspiration, and reminders</p>
        </div>
      </div>

      {/* Add note */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-5">
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Note title (optional)"
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/25 focus:border-[#8B1D3B] bg-[#FFFBF5] transition-colors placeholder:text-[#C4A882]"
            />
          </div>
        </div>
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="Write your note, idea, or reminder..."
          rows={3}
          className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/25 focus:border-[#8B1D3B] bg-[#FFFBF5] transition-colors placeholder:text-[#C4A882] resize-none"
        />
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B5744] font-medium">Color:</span>
            <div className="flex gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.bg}
                  onClick={() => setForm((p) => ({ ...p, color: c.bg }))}
                  className="w-5 h-5 rounded-full border-2 transition-all"
                  style={{ background: c.bg, borderColor: form.color === c.bg ? "#8B1D3B" : c.border }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <button
            onClick={add}
            disabled={!form.title.trim() && !form.content.trim()}
            className="bg-[#8B1D3B] hover:bg-[#6B1530] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors active:scale-95"
          >
            + Add Note
          </button>
        </div>
      </div>

      {/* Notes grid */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => {
            const colorMeta = COLORS.find((c) => c.bg === note.color) || COLORS[0]
            const isEditing = editId === note.id
            return (
              <div
                key={note.id}
                className="rounded-2xl border-2 p-5 transition-colors"
                style={{ background: note.color, borderColor: colorMeta.border }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  {note.title && (
                    <h3 className="font-playfair font-bold text-[#2C1810] text-base leading-tight flex-1">
                      {note.title}
                    </h3>
                  )}
                  <div className="flex gap-1 ml-auto flex-shrink-0">
                    <button
                      onClick={() => isEditing ? saveEdit(note.id) : startEdit(note)}
                      className="text-xs text-[#9B8B7A] hover:text-[#8B1D3B] px-1.5 py-0.5 rounded transition-colors"
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                    <button onClick={() => remove(note.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none">×</button>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    autoFocus
                    className="w-full text-sm text-[#2C1810] bg-white/60 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8B1D3B] resize-none"
                  />
                ) : (
                  <p className="text-sm text-[#6B5744] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c.bg}
                        onClick={() => updateColor(note.id, c.bg)}
                        className="w-3.5 h-3.5 rounded-full border transition-all"
                        style={{ background: c.bg, borderColor: note.color === c.bg ? "#8B1D3B" : c.border }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#9B8B7A]">
                    {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-sm font-medium">No notes yet.</p>
          <p className="text-xs mt-1">Jot down ideas, vendor details, or inspiration.</p>
        </div>
      )}
    </div>
  )
}
