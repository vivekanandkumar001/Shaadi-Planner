import { useState } from "react"
import { Vendor, VendorCategory, VendorStatus } from "../types"
import { generateId, formatINR, inp, btnPrimary } from "../utils"

interface Props {
  vendors: Vendor[]
  onChange: (v: Vendor[]) => void
}

const CATEGORIES: Record<VendorCategory, string> = {
  venue: "Venue", catering: "Catering", decoration: "Decoration",
  photography: "Photography", music: "Music / Band", mehendi: "Mehendi",
  makeup: "Makeup / Hair", transport: "Transport", invitation: "Invitations",
  pandit: "Pandit / Priest", other: "Other",
}

const STATUS_STYLE: Record<VendorStatus, { bg: string; text: string; label: string }> = {
  enquired: { bg: "#F0E6D3", text: "#6B5744", label: "Enquired" },
  booked: { bg: "#DBEAFE", text: "#1D4ED8", label: "Booked" },
  paid: { bg: "#DCFCE7", text: "#166534", label: "Paid" },
  completed: { bg: "#F0FDF4", text: "#15803D", label: "Completed" },
  cancelled: { bg: "#FEE2E2", text: "#B91C1C", label: "Cancelled" },
}

const blank: Omit<Vendor, "id"> = {
  name: "", category: "venue", contact: "", quotedAmount: 0, paidAmount: 0, status: "enquired", notes: "",
}

export default function Vendors({ vendors, onChange }: Props) {
  const [form, setForm] = useState<Omit<Vendor, "id">>(blank)
  const [filter, setFilter] = useState<VendorCategory | "all">("all")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const totalQuoted = vendors.reduce((s, v) => s + v.quotedAmount, 0)
  const totalPaid = vendors.reduce((s, v) => s + v.paidAmount, 0)
  const booked = vendors.filter((v) => v.status !== "enquired" && v.status !== "cancelled").length

  const save = () => {
    if (!form.name.trim()) return
    if (editId) {
      onChange(vendors.map((v) => (v.id === editId ? { ...form, id: editId } : v)))
      setEditId(null)
    } else {
      onChange([...vendors, { ...form, id: generateId() }])
    }
    setForm(blank)
    setShowForm(false)
  }

  const startEdit = (v: Vendor) => {
    setForm({ name: v.name, category: v.category, contact: v.contact, quotedAmount: v.quotedAmount, paidAmount: v.paidAmount, status: v.status, notes: v.notes })
    setEditId(v.id)
    setShowForm(true)
  }

  const remove = (id: string) => onChange(vendors.filter((v) => v.id !== id))

  const filtered = filter === "all" ? vendors : vendors.filter((v) => v.category === filter)
  const usedCats = Array.from(new Set(vendors.map((v) => v.category)))

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Vendors", value: vendors.length, color: "#8B1D3B" },
          { label: "Booked", value: booked, color: "#166534" },
          { label: "Total Quoted", value: formatINR(totalQuoted), color: "#D4900A" },
          { label: "Total Paid", value: formatINR(totalPaid), color: "#5A1228" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8D5B7] p-4">
            <div className="font-playfair text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#9B8B7A] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-6">
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-5">
            {editId ? "Edit Vendor" : "विक्रेता जोड़ें / Add Vendor"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Vendor Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Ravi Photography" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as VendorCategory }))} className={inp}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Contact</label>
              <input type="text" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} placeholder="Phone / email" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Quoted Amount ₹</label>
              <input type="number" min="0" value={form.quotedAmount || ""} onChange={(e) => setForm((p) => ({ ...p, quotedAmount: parseFloat(e.target.value) || 0 }))} placeholder="0" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Paid So Far ₹</label>
              <input type="number" min="0" value={form.paidAmount || ""} onChange={(e) => setForm((p) => ({ ...p, paidAmount: parseFloat(e.target.value) || 0 }))} placeholder="0" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as VendorStatus }))} className={inp}>
                {Object.entries(STATUS_STYLE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Notes</label>
              <input type="text" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Any notes..." className={inp} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} disabled={!form.name.trim()} className={btnPrimary}>{editId ? "Update" : "+ Add Vendor"}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank) }} className="bg-[#F0E6D3] hover:bg-[#E8D5B7] text-[#6B5744] font-medium px-5 py-2 rounded-lg text-sm transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className={btnPrimary + " self-start"}>
          + Add Vendor
        </button>
      )}

      {/* Filter */}
      {vendors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === "all" ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>All</button>
          {usedCats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === c ? "bg-[#8B1D3B] text-white" : "bg-[#F0E6D3] text-[#6B5744] hover:bg-[#E8D5B7]"}`}>
              {CATEGORIES[c]}
            </button>
          ))}
        </div>
      )}

      {/* Vendor list */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FEF0D7] text-[#6B5744] border-b border-[#E8D5B7]">
                  <th className="text-left px-5 py-3 font-medium">Vendor</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Quoted</th>
                  <th className="text-right px-5 py-3 font-medium">Paid</th>
                  <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Due</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => {
                  const s = STATUS_STYLE[v.status]
                  const due = v.quotedAmount - v.paidAmount
                  return (
                    <tr key={v.id} className={`border-t border-[#F0E6D3] hover:bg-[#FFFBF5] transition-colors ${i % 2 ? "bg-[#FFFBF5]" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-[#2C1810]">{v.name}</div>
                        {v.contact && <div className="text-xs text-[#9B8B7A]">{v.contact}</div>}
                        {v.notes && <div className="text-xs text-[#C4A882] italic">{v.notes}</div>}
                      </td>
                      <td className="px-5 py-3 text-[#6B5744] hidden sm:table-cell">{CATEGORIES[v.category]}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[#6B5744]">{v.quotedAmount ? formatINR(v.quotedAmount) : "—"}</td>
                      <td className="px-5 py-3 text-right font-mono font-semibold text-[#8B1D3B]">{v.paidAmount ? formatINR(v.paidAmount) : "—"}</td>
                      <td className="px-5 py-3 text-right font-mono hidden md:table-cell" style={{ color: due > 0 ? "#DC2626" : "#166534" }}>
                        {v.quotedAmount ? formatINR(due) : "—"}
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <button onClick={() => startEdit(v)} className="text-[#9B8B7A] hover:text-[#8B1D3B] transition-colors text-xs px-2 py-1 rounded">Edit</button>
                        <button onClick={() => remove(v.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none">×</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#D4900A] bg-[#FEF0D7]">
                  <td className="px-5 py-3 font-bold text-[#2C1810]" colSpan={3}>Total</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-[#6B5744]">{formatINR(totalQuoted)}</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-[#8B1D3B]">{formatINR(totalPaid)}</td>
                  <td className="px-5 py-3 text-right font-mono font-bold hidden md:table-cell" style={{ color: totalQuoted - totalPaid > 0 ? "#DC2626" : "#166534" }}>
                    {formatINR(totalQuoted - totalPaid)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-sm font-medium">No vendors yet.</p>
          <p className="text-xs mt-1">Track all your wedding service providers here.</p>
        </div>
      ) : null}
    </div>
  )
}
