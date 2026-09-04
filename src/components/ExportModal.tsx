interface ExportModalProps {
  weddingId: string
  onClose: () => void
}

export default function ExportModal({ weddingId, onClose }: ExportModalProps) {
  const handleExport = (type: "guests" | "vendors" | "functions" | "checklist") => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
    window.open(`${backendUrl}/exports/${weddingId}/csv/${type}`, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="font-playfair text-base font-bold text-[#8B1D3B]">Export Wedding Data</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <p className="text-xs text-slate-600">
          Download authenticated CSV spreadsheets generated directly from PostgreSQL.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleExport("guests")}
            className="p-3 bg-[#FFFBF5] hover:bg-amber-100/60 border border-[#E8D5B7] rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-lg">👥</div>
            <div className="text-xs font-bold text-[#8B1D3B]">Guests List</div>
            <div className="text-[10px] text-slate-500">RSVPs, meal preferences, plus-ones</div>
          </button>

          <button
            onClick={() => handleExport("vendors")}
            className="p-3 bg-[#FFFBF5] hover:bg-amber-100/60 border border-[#E8D5B7] rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-lg">🤝</div>
            <div className="text-xs font-bold text-[#8B1D3B]">Vendors Summary</div>
            <div className="text-[10px] text-slate-500">Quoted vs paid balances</div>
          </button>

          <button
            onClick={() => handleExport("functions")}
            className="p-3 bg-[#FFFBF5] hover:bg-amber-100/60 border border-[#E8D5B7] rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-lg">📅</div>
            <div className="text-xs font-bold text-[#8B1D3B]">Function Schedule</div>
            <div className="text-[10px] text-slate-500">Haldi, Sangeet & Vivah timings</div>
          </button>

          <button
            onClick={() => handleExport("checklist")}
            className="p-3 bg-[#FFFBF5] hover:bg-amber-100/60 border border-[#E8D5B7] rounded-xl text-left space-y-1 transition-all"
          >
            <div className="text-lg">✅</div>
            <div className="text-xs font-bold text-[#8B1D3B]">Checklist Tasks</div>
            <div className="text-[10px] text-slate-500">Priorities & completion status</div>
          </button>
        </div>
      </div>
    </div>
  )
}
