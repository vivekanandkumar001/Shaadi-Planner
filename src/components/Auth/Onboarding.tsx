import { useState } from "react"
import { weddingsApi } from "../../api"

interface OnboardingProps {
  onComplete: (wedding: any) => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [brideName, setBrideName] = useState("")
  const [groomName, setGroomName] = useState("")
  const [weddingDate, setWeddingDate] = useState("")
  const [city, setCity] = useState("")
  const [cityTier, setCityTier] = useState<"metro" | "tier2" | "tier3">("metro")
  const [estimatedGuests, setEstimatedGuests] = useState(300)
  const [estimatedBudget, setEstimatedBudget] = useState(2500000)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleFinish = async () => {
    setErrorMsg("")
    const title = brideName && groomName ? `${brideName} & ${groomName}'s Wedding` : "Our Shaadi Plan"

    setLoading(true)
    const res = await weddingsApi.create({
      title,
      brideName: brideName || "Bride",
      groomName: groomName || "Groom",
      weddingDate: weddingDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      city: city || "New Delhi",
      cityTier,
      estimatedGuests: Number(estimatedGuests),
      estimatedBudget: Number(estimatedBudget),
    })
    setLoading(false)

    if (res.success && res.data) {
      onComplete(res.data.wedding)
    } else {
      setErrorMsg(res.error?.message || "Failed to initialize wedding. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E8D5B7] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="font-playfair text-lg font-bold text-[#8B1D3B]">Setup Your Shaadi</h2>
              <p className="text-xs text-slate-500">Step {step} of 3</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === i ? "bg-[#8B1D3B] scale-110" : "bg-amber-200"
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#8B1D3B]">1. Couple Details</h3>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Bride's Name</label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Groom's Name</label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-[#8B1D3B] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#6B1530]"
            >
              Next: Date & Location →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#8B1D3B]">2. Date & Destination</h3>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Wedding Date</label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Jaipur, New Delhi, Udaipur"
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">City Tier</label>
              <select
                value={cityTier}
                onChange={(e: any) => setCityTier(e.target.value)}
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              >
                <option value="metro">Metro (Delhi, Mumbai, Bengaluru, etc.)</option>
                <option value="tier2">Tier 2 (Jaipur, Lucknow, Chandigarh, etc.)</option>
                <option value="tier3">Tier 3 / Destination</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-amber-300 text-slate-700 py-3 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 bg-[#8B1D3B] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#6B1530]"
              >
                Next: Budget & Guests →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-[#8B1D3B]">3. Guest Estimate & Budget</h3>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Estimated Guests: <span className="font-bold text-[#8B1D3B]">{estimatedGuests}</span></label>
              <input
                type="number"
                value={estimatedGuests}
                onChange={(e) => setEstimatedGuests(parseInt(e.target.value) || 0)}
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Total Estimated Budget (₹ INR)</label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(parseInt(e.target.value) || 0)}
                className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:border-[#8B1D3B]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Default: ₹25,00,000 (₹25 Lakhs)</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 border border-amber-300 text-slate-700 py-3 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="w-2/3 bg-[#D4900A] hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg shadow-md active:scale-95 disabled:opacity-50"
              >
                {loading ? "Initializing..." : "Create My Shaadi Plan 🎉"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
