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
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8D5B7] shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 cursor-pointer text-[#8B1D3B] hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">💍</span>
            <span className="font-playfair text-xl font-bold">
              Shaadi <span className="text-[#D4900A]">Planner</span>
            </span>
          </div>
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">Create Your Account</h2>
          <p className="text-xs text-slate-500">Start planning your perfect wedding</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Your Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              required
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.com"
              required
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#8B1D3B] focus:ring-[#8B1D3B]"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight">
              I agree to the <span className="text-[#8B1D3B] underline cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-[#8B1D3B] underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-amber-100">
          Already have an account?{" "}
          <button onClick={onNavigateToLogin} className="text-[#8B1D3B] font-semibold hover:underline">
            Log in
          </button>
        </div>
      </div>
    </div>
  )
}
