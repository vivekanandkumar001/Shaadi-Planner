import { useState } from "react"
import { Note } from "../types"
import { notesApi } from "../api"

interface Props {
  notes: Note[]
  onChange: (n: Note[]) => void
  weddingId?: string
}

const COLORS = [
  { bg: "#FCF8F2", border: "#EAE0D5", label: "Silk Ivory" },
  { bg: "#FEF0D7", border: "#D4AF37", label: "Marigold" },
  { bg: "#FEF2F2", border: "#FCA5A5", label: "Rose" },
  { bg: "#F0FDF4", border: "#86EFAC", label: "Mint" },
  { bg: "#EFF6FF", border: "#93C5FD", label: "Sky" },
  { bg: "#FDF4FF", border: "#D8B4FE", label: "Lavender" },
]

const blank = { title: "", content: "", color: "#FCF8F2" }

export default function Notes({ notes, onChange, weddingId }: Props) {
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(false)

  const add = async () => {
    if (!form.title.trim() && !form.content.trim()) return
    setLoading(true)
    if (weddingId) {
      const res = await notesApi.create(weddingId, form)
      if (res.success && res.data?.note) {
        onChange([res.data.note, ...notes])
      }
    } else {
      onChange([
        { id: Math.random().toString(36).substring(2, 9), title: form.title, content: form.content, color: form.color, createdAt: new Date().toISOString() },
        ...notes,
      ])
    }
    setForm(blank)
    setLoading(false)
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await notesApi.delete(weddingId, id)
    }
    onChange(notes.filter((n) => n.id !== id))
  }

  const startEdit = (n: Note) => { setEditId(n.id); setEditContent(n.content) }

  const saveEdit = async (id: string) => {
    const target = notes.find((n) => n.id === id)
    if (!target) return
    const updated = { ...target, content: editContent }
    onChange(notes.map((n) => (n.id === id ? updated : n)))
    setEditId(null)
    if (weddingId) {
      await notesApi.update(weddingId, id, updated)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER */}
      <div className="border-b border-[#EAE0D5] pb-4">
        <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Wedding Notes & Reminders</h2>
        <p className="text-xs text-[#75676B] font-medium mt-0.5">Keep venue contacts, song playlists, speech drafts, and family reminders in one place</p>
      </div>

      {/* CREATE NOTE FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <h3 className="font-playfair text-lg font-bold text-[#7A1631]">Create New Note</h3>

        <div className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Note Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Sangeet Choreographer Contact & Music List"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Note Content</label>
            <textarea
              rows={3}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Type your notes, contact phone numbers, or song list here..."
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
            {loading ? "Saving..." : "+ Save Note"}
          </button>
        </div>
      </div>

      {/* NOTES GRID */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((n) => {
            const isEditing = editId === n.id

            return (
              <div
                key={n.id}
                className="luxury-card p-6 flex flex-col justify-between space-y-4"
                style={{ background: n.color || "#FCF8F2" }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-[#EAE0D5] pb-2">
                    <h3 className="font-playfair text-base font-bold text-[#7A1631]">{n.title || "Untitled Note"}</h3>
                    <button
                      onClick={() => remove(n.id)}
                      className="text-rose-600 font-bold text-xs hover:underline cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 text-xs">
                      <textarea
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full border border-[#EAE0D5] rounded-xl p-2.5 bg-white text-[#1A1617]"
                      />
                      <button
                        onClick={() => saveEdit(n.id)}
                        className="w-full luxury-button-primary rounded-xl py-2 font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-[#1A1617] whitespace-pre-wrap leading-relaxed font-medium">
                      {n.content}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#75676B] font-semibold">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : ""}
                    </span>
                    <button
                      onClick={() => startEdit(n)}
                      className="text-[#7A1631] font-bold hover:underline cursor-pointer"
                    >
                      Edit Note
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="luxury-card p-12 text-center text-[#75676B] space-y-3">
          <div className="text-4xl">📝</div>
          <p className="text-sm font-semibold">No notes saved yet.</p>
          <p className="text-xs">Create your first note above to save venue details, song lists, or phone numbers.</p>
        </div>
      )}
    </div>
  )
}
