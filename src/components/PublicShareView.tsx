import { useState, useEffect } from "react"
import { shareApi } from "../api"

interface PublicShareViewProps {
  token: string
}

export default function PublicShareView({ token }: PublicShareViewProps) {
  const [wedding, setWedding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    async function loadSharedData() {
      setLoading(true)
      const res = await shareApi.getPublic(token)
      setLoading(false)

      if (res.success && res.data) {
        setWedding(res.data.wedding)
      } else {
        setErrorMsg(res.error?.message || "Invalid or expired share link.")
      }
    }
    loadSharedData()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF8F2] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7A1631] border border-[#D4AF37]/40 text-2xl flex items-center justify-center mx-auto shadow-md animate-bounce">
            💍
          </div>
          <div className="text-xs font-semibold text-[#7A1631]">Loading Royal Wedding Itinerary...</div>
        </div>
      </div>
    )
  }

  if (errorMsg || !wedding) {
    return (
      <div className="min-h-screen bg-[#FCF8F2] flex items-center justify-center p-4">
        <div className="luxury-card p-8 text-center max-w-sm w-full space-y-4">
          <div className="text-4xl">⚠️</div>
          <h3 className="font-playfair text-lg font-bold text-rose-700">Link Expired or Invalid</h3>
          <p className="text-xs text-[#75676B] font-medium">{errorMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FCF8F2] text-[#1A1617] font-sans pb-16 selection:bg-[#D4AF37]/30 selection:text-[#5C0F24]">
      {/* HEADER HERO BANNER */}
      <div className="bg-gradient-to-r from-[#1D060D] via-[#3D0A19] to-[#1D060D] text-white py-16 px-4 text-center space-y-4 border-b border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-[#5C0F24]/80 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-[#E5C358] text-xs font-bold uppercase tracking-widest">
          👑 Royal Wedding Itinerary & Celebration
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider leading-tight">
          {wedding.brideName} <span className="gold-gradient-text">&</span> {wedding.groomName}
        </h1>
        <p className="text-xs sm:text-sm text-[#FCF8F2]/80 font-medium">
          {wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""} • {wedding.city || wedding.location || "Palace Venue"}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* CEREMONIES & FUNCTIONS */}
        {wedding.functions && wedding.functions.length > 0 && (
          <section className="luxury-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#EAE0D5] pb-3">
              <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">
                📅 Ceremonial Schedule & Dress Codes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wedding.functions.map((fn: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[#EAE0D5] bg-[#FCF8F2] space-y-2.5 shadow-sm relative overflow-hidden"
                  style={{ borderLeftWidth: "6px", borderLeftColor: fn.color || "#7A1631" }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-playfair font-bold text-base text-[#7A1631]">{fn.name}</h3>
                    {fn.hindiName && <span className="text-xs font-semibold text-[#D4AF37]">{fn.hindiName}</span>}
                  </div>
                  <div className="text-xs text-[#75676B] font-medium flex items-center gap-2">
                    <span>⏰</span> <span>Timing: {fn.time || "TBD"}</span>
                  </div>
                  {fn.venue && (
                    <div className="text-xs text-[#75676B] font-medium flex items-center gap-2">
                      <span>📍</span> <span>Venue: {fn.venue}</span>
                    </div>
                  )}
                  {fn.dresscode && (
                    <div className="text-xs text-[#7A1631] bg-[#F3E5AB]/40 border border-[#D4AF37]/30 inline-block px-3 py-1 rounded-lg font-bold">
                      👗 Dress Code: {fn.dresscode}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MENU OVERVIEW */}
        {wedding.menuCourses && wedding.menuCourses.length > 0 && (
          <section className="luxury-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#EAE0D5] pb-3">
              <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">
                🍽️ Celebration Dining & Menu Courses
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wedding.menuCourses.map((mc: any, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl border border-[#EAE0D5] bg-white space-y-3 shadow-sm">
                  <div className="flex justify-between items-center border-b border-[#EAE0D5] pb-2">
                    <h3 className="font-bold text-sm text-[#7A1631]">{mc.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FCF8F2] border border-[#EAE0D5] text-[#7A1631]">
                      {mc.mealType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {mc.items.map((item: any, iIdx: number) => (
                      <span key={iIdx} className="text-xs bg-[#FCF8F2] border border-[#EAE0D5] px-3 py-1 rounded-xl text-[#1A1617] font-medium">
                        ✦ {item.name || item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
