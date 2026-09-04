import { useState } from "react"
import { Guest, TableData } from "../types"
import { inp, btnPrimary } from "../utils"
import { seatingApi } from "../api"

interface Props {
  tables: TableData[]
  guests: Guest[]
  onTablesChange: (t: TableData[]) => void
  onGuestsChange: (g: Guest[]) => void
  weddingId?: string
}

export default function Seating({ tables, guests, onTablesChange, onGuestsChange, weddingId }: Props) {
  const [name, setName] = useState("")
  const [cap, setCap] = useState("10")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const addTable = async () => {
    if (!name.trim()) return
    setErrorMsg("")
    setLoading(true)

    if (weddingId) {
      const res = await seatingApi.createTable(weddingId, { name, capacity: parseInt(cap) || 8 })
      if (res.success && res.data?.table) {
        onTablesChange([...tables, res.data.table])
      } else {
        setErrorMsg(res.error?.message || "Failed to create table.")
      }
    } else {
      onTablesChange([...tables, { id: Math.random().toString(36).substring(2, 9), name, capacity: parseInt(cap) || 8 }])
    }
    setName("")
    setCap("10")
    setLoading(false)
  }

  const removeTable = async (id: string) => {
    if (weddingId) {
      await seatingApi.deleteTable(weddingId, id)
    }
    onTablesChange(tables.filter((t) => t.id !== id))
    onGuestsChange(guests.map((g) => (g.tableId === id ? { ...g, tableId: null } : g)))
  }

  const handleAssign = async (guestId: string, tableId: string) => {
    setErrorMsg("")
    if (weddingId) {
      const res = await seatingApi.assignGuest(weddingId, guestId, tableId)
      if (res.success) {
        onGuestsChange(guests.map((g) => (g.id === guestId ? { ...g, tableId } : g)))
      } else {
        setErrorMsg(res.error?.message || "Could not assign guest.")
      }
    } else {
      onGuestsChange(guests.map((g) => (g.id === guestId ? { ...g, tableId } : g)))
    }
  }

  const unassigned = guests.filter((g) => !g.tableId)
  const totalSeated = guests.filter((g) => g.tableId).reduce((s, g) => s + 1 + g.plusOnes, 0)
  const totalCapacity = tables.reduce((s, t) => s + t.capacity, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      {tables.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tables", value: tables.length, color: "#8B1D3B" },
            { label: "Seated", value: totalSeated, color: "#166534" },
            { label: "Total Capacity", value: totalCapacity, color: "#D4900A" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8D5B7] p-4 text-center shadow-sm">
              <div className="font-playfair text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[#9B8B7A] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8D5B7] p-6">
        <h2 className="font-playfair text-xl font-bold text-[#8B1D3B] mb-1">बैठक व्यवस्था</h2>
        <p className="text-xs text-[#9B8B7A] mb-5">Seating Planner — create tables and assign guests</p>
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Table Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTable()}
              placeholder="e.g. Marigold Table"
              className="border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/25 focus:border-[#8B1D3B] bg-[#FFFBF5] w-48 transition-colors placeholder:text-[#C4A882]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B5744] mb-1">Capacity</label>
            <input
              type="number"
              min="1"
              max="50"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              className="border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/25 focus:border-[#8B1D3B] bg-[#FFFBF5] w-24 transition-colors"
            />
          </div>
          <button onClick={addTable} disabled={!name.trim() || loading} className={btnPrimary}>
            {loading ? "Adding..." : "+ Add Table"}
          </button>
        </div>
      </div>

      {/* Unassigned banner */}
      {unassigned.length > 0 && tables.length > 0 && (
        <div className="bg-[#FEF0D7] rounded-xl border border-[#E8D5B7] px-5 py-4 shadow-sm">
          <p className="text-xs font-medium text-[#6B5744] mb-2">
            {unassigned.length} guest{unassigned.length > 1 ? "s" : ""} unassigned — assign tables directly below:
          </p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((g) => (
              <div key={g.id} className="bg-white border border-[#E8D5B7] text-[#6B5744] text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span>{g.name}</span>
                <select
                  value=""
                  onChange={(e) => e.target.value && handleAssign(g.id, e.target.value)}
                  className="text-[10px] border border-amber-300 rounded bg-[#FFFBF5] px-1 py-0.5"
                >
                  <option value="">Assign Table</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table cards */}
      {tables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => {
            const assigned = guests.filter((g) => g.tableId === table.id)
            const headcount = assigned.reduce((s, g) => s + 1 + g.plusOnes, 0)
            const pct = Math.min(100, Math.round((headcount / table.capacity) * 100))
            const full = headcount >= table.capacity
            return (
              <div
                key={table.id}
                className={`bg-white rounded-2xl border-2 p-5 transition-colors shadow-sm ${full ? "border-[#D4900A]" : "border-[#E8D5B7] hover:border-[#8B1D3B]/30"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-playfair font-bold text-[#2C1810]">{table.name}</h3>
                    <p className={`text-xs mt-0.5 ${full ? "text-[#D4900A] font-medium" : "text-[#9B8B7A]"}`}>
                      {headcount} / {table.capacity} seats{full ? " · Full" : ""}
                    </p>
                  </div>
                  <button onClick={() => removeTable(table.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none ml-2">×</button>
                </div>
                <div className="w-full bg-[#F0E6D3] rounded-full h-1.5 mb-4">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: full ? "#D4900A" : "#8B1D3B" }}
                  />
                </div>
                {assigned.length === 0 ? (
                  <p className="text-xs text-[#C4A882] italic">No guests assigned</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {assigned.map((g) => (
                      <span
                        key={g.id}
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${g.side === "bride" ? "bg-pink-50 border-pink-200 text-pink-700" : g.side === "groom" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-purple-50 border-purple-200 text-purple-700"}`}
                      >
                        {g.name}{g.plusOnes > 0 ? ` +${g.plusOnes}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">🪑</div>
          <p className="text-sm font-medium">No tables added yet.</p>
          <p className="text-xs mt-1">Add tables to arrange your baraat seating!</p>
        </div>
      )}
    </div>
  )
}
