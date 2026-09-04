import { useState } from "react"
import { migrationApi } from "../api"

interface MigrateModalProps {
  localData: any
  onClose: () => void
  onSuccess: () => void
}

export default function MigrateModal({ localData, onClose, onSuccess }: MigrateModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleMigrate = async () => {
    setLoading(true)
    setErrorMsg("")
    const res = await migrationApi.importLocalData(localData)
    setLoading(false)

    if (res.success) {
      // Clear localStorage legacy key after cloud migration
      localStorage.removeItem("shaadi_saathi_v2")
      onSuccess()
    } else {
      setErrorMsg(res.error?.message || "Migration failed. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
            📦
          </div>
          <div>
            <h3 className="font-playfair text-base font-bold text-[#8B1D3B]">Existing Local Data Found</h3>
            <p className="text-xs text-slate-500">Sync browser data to PostgreSQL</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-[#FFFBF5] p-3 rounded-lg border border-[#E8D5B7]">
          We detected an existing offline wedding plan in your browser ({localData.coupleName || "Shaadi Plan"}).
          Would you like to import all your guests, budget, vendors, functions, checklist, and notes into your cloud account?
        </p>

        {errorMsg && <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded">⚠️ {errorMsg}</div>}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
          >
            Keep Local Only
          </button>
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="w-1/2 bg-[#8B1D3B] hover:bg-[#6B1530] text-white py-2.5 rounded-lg text-xs font-medium shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Sync to PostgreSQL Cloud 🚀"}
          </button>
        </div>
      </div>
    </div>
  )
}
