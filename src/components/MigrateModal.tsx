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
    <div className="fixed inset-0 z-50 bg-[#1D060D]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="luxury-card max-w-md w-full p-6 sm:p-8 space-y-5 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-[#EAE0D5] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7A1631] border border-[#D4AF37]/50 flex items-center justify-center text-xl shadow">
            📦
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#7A1631]">Local Browser Data Detected</h3>
            <p className="text-xs text-[#75676B] font-medium">Import offline data into PostgreSQL Cloud</p>
          </div>
        </div>

        <p className="text-xs text-[#1A1617] leading-relaxed bg-[#FCF8F2] p-4 rounded-xl border border-[#EAE0D5] font-medium">
          We detected an existing offline wedding plan in your browser ({localData.coupleName || "Shaadi Plan"}).
          Would you like to import all guest lists, budget items, vendors, functions, checklists, and notes into your cloud account?
        </p>

        {errorMsg && <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">⚠️ {errorMsg}</div>}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="w-1/2 border border-[#EAE0D5] text-[#7A1631] py-3 rounded-xl text-xs font-bold uppercase cursor-pointer hover:bg-[#FCF8F2]"
          >
            Keep Local Only
          </button>
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="w-1/2 luxury-button-primary font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Syncing..." : "Import to Cloud 🚀"}
          </button>
        </div>
      </div>
    </div>
  )
}
