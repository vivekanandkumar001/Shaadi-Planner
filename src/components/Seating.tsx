import { useState } from "react"
import { Guest, TableData } from "../types"
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
    <div className="space-y-8 animate-fade-in-up">
      {/* SUMMARY METRICS */}
      {tables.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="luxury-card p-5 text-left">
            <div className="font-cinzel text-2xl font-bold text-[#7A1631]">{tables.length}</div>
            <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Configured Tables</div>
          </div>
          <div className="luxury-card p-5 text-left">
            <div className="font-cinzel text-2xl font-bold text-emerald-600">{totalSeated}</div>
            <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Assigned Guests</div>
          </div>
          <div className="luxury-card p-5 text-left">
            <div className="font-cinzel text-2xl font-bold text-[#D4AF37]">{totalCapacity}</div>
            <div className="text-xs font-semibold text-[#75676B] mt-1 uppercase tracking-wider">Total Venue Capacity</div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2 shadow-sm">
          <span>⚠️</span>
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* CREATE TABLE FORM */}
      <div className="luxury-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#EAE0D5] pb-3">
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Seating Planner & Table Layout</h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Design seating capacity and assign confirmed guest parties</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
          <div className="sm:col-span-2">
            <label className="block text-[#1A1617] font-semibold mb-1.5">Table Name / Zone *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Family Table 1"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Max Seat Capacity *</label>
            <input
              type="number"
              min="1"
              max="50"
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
            />
          </div>
        </div>

        <div>
          <button
            onClick={addTable}
            disabled={loading}
            className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Adding..." : "+ Create Table"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UNASSIGNED GUESTS SIDEBAR */}
        <div className="luxury-card overflow-hidden h-fit">
          <div className="p-5 bg-[#FCF8F2]/60 border-b border-[#EAE0D5]">
            <h3 className="font-playfair text-base font-bold text-[#7A1631]">
              Unassigned Guests ({unassigned.length})
            </h3>
            <p className="text-xs text-[#75676B] font-medium mt-0.5">Select a table to assign each guest</p>
          </div>

          {unassigned.length > 0 ? (
            <div className="divide-y divide-[#EAE0D5] max-h-[450px] overflow-y-auto">
              {unassigned.map((g) => (
                <div key={g.id} className="p-4 space-y-2 hover:bg-[#FCF8F2]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-[#1A1617]">{g.name}</div>
                    <span className="text-[10px] uppercase font-bold text-[#75676B]">{g.side} side</span>
                  </div>
                  <select
                    onChange={(e) => e.target.value && handleAssign(g.id, e.target.value)}
                    defaultValue=""
                    className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EAE0D5] bg-[#FCF8F2] text-[#7A1631] focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Assign to Table...
                    </option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.capacity} Max)
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#75676B] text-xs">
              🎉 All confirmed guests have been assigned to tables!
            </div>
          )}
        </div>

        {/* TABLES GRID */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tables.map((t) => {
            const tableGuests = guests.filter((g) => g.tableId === t.id)
            const seatedCount = tableGuests.reduce((s, g) => s + 1 + g.plusOnes, 0)
            const isFull = seatedCount >= t.capacity

            return (
              <div key={t.id} className="luxury-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-playfair text-base font-bold text-[#7A1631]">{t.name}</h4>
                      <span className="text-xs text-[#75676B] font-medium">
                        Capacity: {seatedCount} / {t.capacity} Seats
                      </span>
                    </div>
                    <button
                      onClick={() => removeTable(t.id)}
                      className="text-rose-600 hover:text-rose-900 font-bold text-xs cursor-pointer px-2 py-1 bg-rose-50 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="w-full bg-[#EAE0D5] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${isFull ? "bg-amber-600" : "bg-[#10B981]"}`}
                      style={{ width: `${Math.min(100, (seatedCount / t.capacity) * 100)}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {tableGuests.map((g) => (
                      <div
                        key={g.id}
                        className="text-xs bg-[#FCF8F2] p-2 rounded-lg border border-[#EAE0D5] flex items-center justify-between font-medium"
                      >
                        <span>{g.name} {g.plusOnes > 0 ? `(+${g.plusOnes})` : ""}</span>
                        <button
                          onClick={() => handleAssign(g.id, "")}
                          className="text-[10px] font-bold text-rose-700 hover:underline"
                        >
                          Unassign
                        </button>
                      </div>
                    ))}
                    {tableGuests.length === 0 && (
                      <div className="text-xs text-[#75676B] italic p-3 text-center bg-[#FCF8F2]/50 rounded-lg">
                        Empty Table
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
