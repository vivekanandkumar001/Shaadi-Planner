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
    <div className="min-h-screen bg-[#FCF8F2] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30 selection:text-[#5C0F24]">
      <div className="w-full max-w-lg luxury-card p-8 sm:p-10 space-y-6 animate-fade-in-up">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#EAE0D5] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#7A1631]">Setup Your Royal Shaadi</h2>
              <p className="text-xs text-[#75676B] font-semibold">Step {step} of 3</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  step === i ? "bg-[#7A1631] scale-110 shadow-sm" : "bg-[#EAE0D5]"
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2 shadow-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 text-xs font-medium">
            <h3 className="font-semibold text-sm text-[#7A1631]">1. Couple & Family Details</h3>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Bride's Name *</label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Groom's Name *</label>
              <input
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full luxury-button-primary font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Next: Date & Location →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 text-xs font-medium">
            <h3 className="font-semibold text-sm text-[#7A1631]">2. Ceremony Date & Destination</h3>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Wedding Date *</label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">City / Destination *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Udaipur, Jaipur, New Delhi"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">City Tier Classification *</label>
              <select
                value={cityTier}
                onChange={(e: any) => setCityTier(e.target.value)}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
              >
                <option value="metro">Metro (Delhi, Mumbai, Bengaluru, etc.)</option>
                <option value="tier2">Tier 2 (Jaipur, Lucknow, Chandigarh, etc.)</option>
                <option value="tier3">Tier 3 / Destination Palace</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-[#EAE0D5] text-[#7A1631] font-bold py-3.5 rounded-xl text-xs uppercase cursor-pointer hover:bg-[#FCF8F2]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 luxury-button-primary font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Next: Budget & Guests →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4 text-xs font-medium">
            <h3 className="font-semibold text-sm text-[#7A1631]">3. Guest Capacity & Target Budget</h3>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">
                Estimated Guests: <span className="font-bold text-[#7A1631]">{estimatedGuests}</span>
              </label>
              <input
                type="number"
                value={estimatedGuests}
                onChange={(e) => setEstimatedGuests(parseInt(e.target.value) || 0)}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Total Estimated Budget (₹ INR)</label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(parseInt(e.target.value) || 0)}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
              <p className="text-[11px] text-[#75676B] mt-1 font-medium">Default target: ₹25,00,000 (₹25 Lakhs)</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 border border-[#EAE0D5] text-[#7A1631] font-bold py-3.5 rounded-xl text-xs uppercase cursor-pointer hover:bg-[#FCF8F2]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="w-2/3 luxury-button-gold font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
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
