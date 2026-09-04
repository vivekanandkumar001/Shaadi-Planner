import { useState } from "react"
import { authApi } from "../../api"

interface ForgotPasswordProps {
  onBackToLogin: () => void
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const res = await authApi.forgotPassword(email)
    setLoading(false)

    setSubmitted(true)
    setMsg(res.message || "Password reset instructions sent.")
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8D5B7] shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl">🔑</div>
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">Reset Your Password</h2>
          <p className="text-xs text-slate-500">Enter your account email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-lg leading-relaxed text-center">
              {msg}
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full bg-[#8B1D3B] text-white py-2.5 rounded-lg text-xs font-medium"
            >
              Return to Login
            </button>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs text-[#8B1D3B] font-semibold hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
