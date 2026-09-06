import { useState } from "react"
import { authApi } from "../../api"

interface RegisterProps {
  onRegisterSuccess: (user: any, token: string) => void
  onNavigateToLogin: () => void
  onBackToLanding: () => void
}

export default function Register({
  onRegisterSuccess,
  onNavigateToLogin,
  onBackToLanding,
}: RegisterProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      return
    }

    if (!acceptedTerms) {
      setErrorMsg("You must accept the Terms of Service and Privacy Policy.")
      return
    }

    setLoading(true)
    const res = await authApi.register({ name, email, password, phone })
    setLoading(false)

    if (res.success && res.data) {
      onRegisterSuccess(res.data.user, res.data.token)
    } else {
      setErrorMsg(res.error?.message || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF8F2] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30 selection:text-[#5C0F24]">
      <div className="w-full max-w-md luxury-card p-8 sm:p-10 space-y-6 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div
            onClick={onBackToLanding}
            className="inline-flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7A1631] border border-[#D4AF37]/50 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              💍
            </div>
            <span className="font-cinzel text-xl font-bold text-[#1A1617] tracking-wider">
              SHAADI <span className="gold-gradient-text">PLANNER</span>
            </span>
          </div>
          <div className="space-y-1 pt-1">
            <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Create Your Account</h2>
            <p className="text-xs text-[#75676B] font-medium">Start planning your perfect wedding</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
            <span className="text-base">⚠️</span>
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1">Your Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#1A1617] font-semibold mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#7A1631] focus:ring-[#7A1631] cursor-pointer"
            />
            <label htmlFor="terms" className="text-[11px] text-[#75676B] leading-tight cursor-pointer">
              I agree to the <span className="text-[#7A1631] font-bold underline">Terms of Service</span> and{" "}
              <span className="text-[#7A1631] font-bold underline">Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full luxury-button-primary font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="text-center text-xs text-[#75676B] pt-4 border-t border-[#EAE0D5]">
          Already have an account?{" "}
          <button onClick={onNavigateToLogin} className="text-[#7A1631] font-bold hover:underline cursor-pointer">
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}
