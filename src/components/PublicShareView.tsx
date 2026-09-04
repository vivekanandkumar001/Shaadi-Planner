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
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-bounce">💍</div>
          <div className="text-xs font-semibold text-[#8B1D3B]">Loading Wedding Invitation & Timeline...</div>
        </div>
      </div>
    )
  }

  if (errorMsg || !wedding) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-200 text-center max-w-sm w-full space-y-3">
          <div className="text-3xl">⚠️</div>
          <h3 className="font-playfair text-base font-bold text-rose-700">Link Not Found</h3>
          <p className="text-xs text-slate-500">{errorMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2C1810] font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-[#3A0C1A] text-white py-12 px-4 text-center space-y-3 border-b border-amber-500/30">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full text-amber-300 text-xs font-medium">
          💍 Wedding Celebration Details
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold">{wedding.brideName} & {wedding.groomName}</h1>
        <p className="text-xs sm:text-sm text-amber-100/80 font-light">
          {new Date(wedding.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • {wedding.city || wedding.location}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {/* FUNCTIONS TIMELINE */}
        {wedding.functions && wedding.functions.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E8D5B7] shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">📅 Wedding Functions & Timeline</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wedding.functions.map((fn: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200/60 bg-[#FFFBF5] space-y-1.5"
                  style={{ borderLeftWidth: "4px", borderLeftColor: fn.color || "#8B1D3B" }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-playfair font-bold text-sm text-[#8B1D3B]">{fn.name}</h3>
                    {fn.hindiName && <span className="text-xs text-amber-700">{fn.hindiName}</span>}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">⏰ Time: {fn.time || "TBD"}</div>
                  {fn.venue && <div className="text-xs text-slate-600">📍 Venue: {fn.venue}</div>}
                  {fn.dresscode && <div className="text-xs text-amber-800 bg-amber-100/60 inline-block px-2 py-0.5 rounded text-[11px]">👗 Dress Code: {fn.dresscode}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MENU OVERVIEW */}
        {wedding.menuCourses && wedding.menuCourses.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-[#E8D5B7] shadow-sm space-y-4">
            <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">🍽️ Planned Menu Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wedding.menuCourses.map((mc: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-xs text-[#8B1D3B]">{mc.name}</h3>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {mc.mealType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mc.items.map((item: any, iIdx: number) => (
                      <span key={iIdx} className="text-[11px] bg-[#FFFBF5] border border-[#E8D5B7] px-2.5 py-1 rounded-full text-slate-700">
                        {item.name}
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
