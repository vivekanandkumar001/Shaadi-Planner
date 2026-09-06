import { useState } from "react"
import { authApi } from "../../api"

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void
  onNavigateToRegister: () => void
  onNavigateToForgotPassword: () => void
  onBackToLanding: () => void
}

export default function Login({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onBackToLanding,
}: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.")
      return
    }

    setLoading(true)
    const res = await authApi.login({ email, password })
    setLoading(false)

    if (res.success && res.data) {
      onLoginSuccess(res.data.user, res.data.token)
    } else {
      setErrorMsg(res.error?.message || "Invalid email or password.")
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
            <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Welcome Back</h2>
            <p className="text-xs text-[#75676B] font-medium">Log in to manage your wedding platform</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
            <span className="text-base">⚠️</span>
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-[#1A1617] font-semibold mb-1.5">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-3 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#1A1617] font-semibold">Password *</label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[11px] text-[#7A1631] hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-[#EAE0D5] rounded-xl px-4 py-3 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] focus:ring-1 focus:ring-[#7A1631] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full luxury-button-primary font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-xs text-[#75676B] pt-4 border-t border-[#EAE0D5]">
          Don't have a Shaadi Planner account?{" "}
          <button onClick={onNavigateToRegister} className="text-[#7A1631] font-bold hover:underline cursor-pointer">
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}
