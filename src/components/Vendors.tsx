import { useState } from "react"
import { Vendor, VendorCategory, VendorStatus } from "../types"
import { formatINR } from "../utils"
import { vendorsApi } from "../api"

interface Props {
  vendors: Vendor[]
  onChange: (v: Vendor[]) => void
  weddingId?: string
}

const CATEGORIES: Record<VendorCategory, string> = {
  venue: "Venue & Palace", catering: "Catering & Food", decoration: "Decoration & Flowers",
  photography: "Photography & Video", music: "Music, DJ & Band", mehendi: "Mehendi Artist",
  makeup: "Makeup & Hair", transport: "Transport & Luxury Cars", invitation: "Invitations & Stationery",
  pandit: "Pandit & Rituals", other: "Other Services",
}

const STATUS_STYLE: Record<VendorStatus, { bg: string; text: string; label: string }> = {
  enquired: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", label: "Enquired" },
  booked: { bg: "bg-blue-50 border-blue-200", text: "text-blue-800", label: "Booked" },
  paid: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", label: "Paid Deposit" },
  completed: { bg: "bg-green-50 border-green-200", text: "text-green-800", label: "Completed" },
  cancelled: { bg: "bg-rose-50 border-rose-200", text: "text-rose-800", label: "Cancelled" },
}

const blank: Omit<Vendor, "id"> = {
  name: "", category: "venue", contact: "", quotedAmount: 0, paidAmount: 0, status: "enquired", notes: "",
}

export default function Vendors({ vendors, onChange, weddingId }: Props) {
  const [form, setForm] = useState<Omit<Vendor, "id">>(blank)
  const [filter, setFilter] = useState<VendorCategory | "all">("all")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const totalQuoted = vendors.reduce((s, v) => s + v.quotedAmount, 0)
  const totalPaid = vendors.reduce((s, v) => s + v.paidAmount, 0)
  const booked = vendors.filter((v) => v.status !== "enquired" && v.status !== "cancelled").length

  const save = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    if (weddingId) {
      if (editId) {
        const res = await vendorsApi.update(weddingId, editId, form)
        if (res.success && res.data?.vendor) {
          onChange(vendors.map((v) => (v.id === editId ? res.data.vendor : v)))
        }
      } else {
        const res = await vendorsApi.create(weddingId, form)
        if (res.success && res.data?.vendor) {
          onChange([...vendors, res.data.vendor])
        }
      }
    } else {
      if (editId) {
        onChange(vendors.map((v) => (v.id === editId ? { ...form, id: editId } : v)))
      } else {
        onChange([...vendors, { ...form, id: Math.random().toString(36).substring(2, 9) }])
      }
    }
    setForm(blank)
    setEditId(null)
    setShowForm(false)
    setLoading(false)
  }

  const startEdit = (v: Vendor) => {
    setForm({ name: v.name, category: v.category, contact: v.contact, quotedAmount: v.quotedAmount, paidAmount: v.paidAmount, status: v.status, notes: v.notes })
    setEditId(v.id)
    setShowForm(true)
  }

  const remove = async (id: string) => {
    if (weddingId) {
      await vendorsApi.delete(weddingId, id)
    }
    onChange(vendors.filter((v) => v.id !== id))
  }

  const filtered = filter === "all" ? vendors : vendors.filter((v) => v.category === filter)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-[#7A1631]">{vendors.length}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Vendors</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-emerald-600">{booked}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Booked / Active</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-[#D4AF37]">{formatINR(totalQuoted)}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Quoted</div>
        </div>
        <div className="luxury-card p-5 text-left">
          <div className="font-cinzel text-2xl font-bold text-[#1A1617]">{formatINR(totalPaid)}</div>
          <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Paid</div>
        </div>
      </div>

      {/* HEADER & ACTION */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EAE0D5] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Vendor Directory & Payments</h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Shortlist, book, and track financial balances across wedding services</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false)
              setEditId(null)
              setForm(blank)
            } else {
              setShowForm(true)
            }
          }}
          className="luxury-button-primary font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
        >
          {showForm ? "✕ Close Form" : "+ Add Vendor"}
        </button>
      </div>

      {/* VENDOR EDIT/ADD FORM */}
      {showForm && (
        <div className="luxury-card p-6 sm:p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#7A1631]">
            {editId ? "Edit Vendor Details" : "Register New Vendor"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium">
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Vendor / Agency Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Decorators Jaipur"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>

            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as VendorCategory })}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
              >
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Contact Number / Email</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>

            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Quoted Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.quotedAmount}
                onChange={(e) => setForm({ ...form, quotedAmount: parseFloat(e.target.value) || 0 })}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>

            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Paid Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={form.paidAmount}
                onChange={(e) => setForm({ ...form, paidAmount: parseFloat(e.target.value) || 0 })}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>

            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Booking Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as VendorStatus })}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
              >
                <option value="enquired">Enquired</option>
                <option value="booked">Booked</option>
                <option value="paid">Paid Deposit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="luxury-button-primary font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Saving..." : editId ? "Update Vendor" : "Save Vendor"}
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setEditId(null)
                setForm(blank)
              }}
              className="px-5 py-3 rounded-xl text-xs font-semibold border border-[#EAE0D5] text-[#75676B] hover:bg-[#FCF8F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap uppercase ${
            filter === "all"
              ? "bg-[#7A1631] text-white border-[#7A1631] shadow-sm"
              : "bg-white text-[#75676B] border-[#EAE0D5] hover:bg-[#FCF8F2]"
          }`}
        >
          All Categories ({vendors.length})
        </button>
        {Object.entries(CATEGORIES).map(([catKey, catName]) => {
          const count = vendors.filter((v) => v.category === catKey).length
          if (count === 0 && filter !== catKey) return null
          return (
            <button
              key={catKey}
              onClick={() => setFilter(catKey as VendorCategory)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap uppercase ${
                filter === catKey
                  ? "bg-[#7A1631] text-white border-[#7A1631] shadow-sm"
                  : "bg-white text-[#75676B] border-[#EAE0D5] hover:bg-[#FCF8F2]"
              }`}
            >
              {catName} ({count})
            </button>
          )
        })}
      </div>

      {/* VENDOR CARD GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => {
            const st = STATUS_STYLE[v.status]
            const remaining = v.quotedAmount - v.paidAmount
            const pct = v.quotedAmount ? Math.min(100, Math.round((v.paidAmount / v.quotedAmount) * 100)) : 0

            return (
              <div key={v.id} className="luxury-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#75676B] uppercase tracking-wider block">
                        {CATEGORIES[v.category]}
                      </span>
                      <h3 className="font-playfair text-lg font-bold text-[#7A1631] mt-0.5">{v.name}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>

                  {v.contact && (
                    <div className="text-xs text-[#75676B] flex items-center gap-1.5 font-medium">
                      <span>📞</span> <span>{v.contact}</span>
                    </div>
                  )}

                  {/* Financial Breakdown */}
                  <div className="bg-[#FCF8F2] p-3.5 rounded-xl border border-[#EAE0D5] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#75676B]">Quoted:</span>
                      <span className="font-bold text-[#1A1617]">{formatINR(v.quotedAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#75676B]">Paid:</span>
                      <span className="font-bold text-emerald-700">{formatINR(v.paidAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#EAE0D5] pt-1.5 font-semibold">
                      <span className="text-[#75676B]">Remaining Dues:</span>
                      <span className={remaining > 0 ? "text-rose-700 font-bold" : "text-emerald-700"}>
                        {formatINR(remaining > 0 ? remaining : 0)}
                      </span>
                    </div>
                    <div className="w-full bg-[#EAE0D5] rounded-full h-1.5 overflow-hidden mt-1">
                      <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => startEdit(v)}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE0D5] text-[#7A1631] font-semibold hover:bg-[#FCF8F2] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(v.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 font-semibold bg-rose-50 hover:bg-rose-100 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="luxury-card p-12 text-center text-[#75676B] space-y-3">
          <div className="text-4xl">🤝</div>
          <p className="text-sm font-semibold">No vendor entries registered for this category.</p>
          <p className="text-xs">Add venue managers, caterers, photographers, and decorators above.</p>
        </div>
      )}
    </div>
  )
}
