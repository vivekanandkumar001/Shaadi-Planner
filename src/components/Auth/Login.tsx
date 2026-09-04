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
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">Welcome Back</h2>
          <p className="text-xs text-slate-500">Log in to manage your wedding platform</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2.5 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-700 font-medium">Password</label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[11px] text-[#8B1D3B] hover:underline"
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
              className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2.5 bg-[#FFFBF5] focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/20 focus:border-[#8B1D3B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-amber-100">
          Don't have a Shaadi Planner account?{" "}
          <button onClick={onNavigateToRegister} className="text-[#8B1D3B] font-semibold hover:underline">
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}
