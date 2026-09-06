interface ExportModalProps {
  weddingId: string
  onClose: () => void
}

export default function ExportModal({ weddingId, onClose }: ExportModalProps) {
  const handleExport = (type: "guests" | "vendors" | "functions" | "checklist") => {
    const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
    const cleaned = rawUrl.replace(/\/$/, "")
    const backendUrl = cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`
    window.open(`${backendUrl}/exports/${weddingId}/csv/${type}`, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1D060D]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="luxury-card max-w-md w-full p-6 sm:p-8 space-y-5 animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-[#EAE0D5] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📊</span>
            <h3 className="font-playfair text-lg font-bold text-[#7A1631]">Export Wedding Data</h3>
          </div>
          <button onClick={onClose} className="text-[#75676B] hover:text-[#1A1617] font-bold text-sm cursor-pointer">✕</button>
        </div>

        <p className="text-xs text-[#75676B] font-medium leading-relaxed">
          Download structured CSV spreadsheets directly from PostgreSQL for offline record keeping or printing.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <button
            onClick={() => handleExport("guests")}
            className="p-4 bg-[#FCF8F2] hover:bg-white border border-[#EAE0D5] hover:border-[#D4AF37]/50 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group shadow-sm"
          >
            <div className="text-xl">👥</div>
            <div className="text-xs font-bold text-[#7A1631] group-hover:text-[#5C0F24]">Guests List</div>
            <div className="text-[10px] text-[#75676B]">RSVPs, meal preferences, plus-ones</div>
          </button>

          <button
            onClick={() => handleExport("vendors")}
            className="p-4 bg-[#FCF8F2] hover:bg-white border border-[#EAE0D5] hover:border-[#D4AF37]/50 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group shadow-sm"
          >
            <div className="text-xl">🤝</div>
            <div className="text-xs font-bold text-[#7A1631] group-hover:text-[#5C0F24]">Vendors Summary</div>
            <div className="text-[10px] text-[#75676B]">Quoted vs paid balances</div>
          </button>

          <button
            onClick={() => handleExport("functions")}
            className="p-4 bg-[#FCF8F2] hover:bg-white border border-[#EAE0D5] hover:border-[#D4AF37]/50 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group shadow-sm"
          >
            <div className="text-xl">📅</div>
            <div className="text-xs font-bold text-[#7A1631] group-hover:text-[#5C0F24]">Function Schedule</div>
            <div className="text-[10px] text-[#75676B]">Haldi, Sangeet & Vivah timings</div>
          </button>

          <button
            onClick={() => handleExport("checklist")}
            className="p-4 bg-[#FCF8F2] hover:bg-white border border-[#EAE0D5] hover:border-[#D4AF37]/50 rounded-2xl text-left space-y-1.5 transition-all cursor-pointer group shadow-sm"
          >
            <div className="text-xl">✅</div>
            <div className="text-xs font-bold text-[#7A1631] group-hover:text-[#5C0F24]">Checklist Tasks</div>
            <div className="text-[10px] text-[#75676B]">Priorities & completion status</div>
          </button>
        </div>
      </div>
    </div>
  )
}
