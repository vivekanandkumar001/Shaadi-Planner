interface LegalProps {
  onBack: () => void
}

export default function TermsOfService({ onBack }: LegalProps) {
  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2C1810] p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 sm:p-10 shadow-sm space-y-6">
        <button onClick={onBack} className="text-xs text-[#8B1D3B] font-semibold hover:underline">
          ← Back
        </button>

        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#8B1D3B]">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: September 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">1. Acceptance of Terms</h2>
            <p>
              By accessing or creating an account on Shaadi Planner, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">2. User Account Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">3. Acceptable Use</h2>
            <p>
              Shaadi Planner is designed for legitimate wedding planning. You agree not to upload malicious payloads, attempt unauthorized cross-user access, or engage in automated scraping.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">4. Service Availability</h2>
            <p>
              While we strive for 99.9% cloud availability on our Render infrastructure, Shaadi Planner is provided "as-is" without warranty of uninterrupted operation.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">5. Contact</h2>
            <p>For questions regarding terms, contact legal@shaadiplanner.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
