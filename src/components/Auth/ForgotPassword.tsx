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
    <div className="min-h-screen bg-[#FCF8F2] flex items-center justify-center p-4 selection:bg-[#D4AF37]/30 selection:text-[#5C0F24]">
      <div className="w-full max-w-md luxury-card p-8 sm:p-10 space-y-6 animate-fade-in-up">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7A1631] border border-[#D4AF37]/50 flex items-center justify-center text-2xl mx-auto shadow-md">
            🔑
          </div>
          <div className="space-y-1">
            <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Reset Your Password</h2>
            <p className="text-xs text-[#75676B] font-medium">Enter your account email to receive reset instructions</p>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl leading-relaxed text-center font-medium">
              {msg}
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full luxury-button-primary font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-3 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-button-primary font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs text-[#7A1631] font-bold hover:underline cursor-pointer"
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
