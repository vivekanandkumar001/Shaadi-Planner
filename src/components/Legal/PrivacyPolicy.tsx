interface LegalProps {
  onBack: () => void
}

export default function PrivacyPolicy({ onBack }: LegalProps) {
  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2C1810] p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 sm:p-10 shadow-sm space-y-6">
        <button onClick={onBack} className="text-xs text-[#8B1D3B] font-semibold hover:underline">
          ← Back
        </button>

        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#8B1D3B]">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: September 2026</p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">1. Information We Collect</h2>
            <p>
              Shaadi Planner collects account information (name, email, password hashes, and optional phone numbers) as well as user-submitted wedding planning data (guest names, dietary preferences, vendor payments, seating allocations, shagun entries, and event notes).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">2. How We Use Your Data</h2>
            <p>
              Your data is strictly used to deliver cloud synchronization, calculate budget breakdowns, provide RSVP counts, and allow secure collaboration across your personal devices. We do not sell your personal or guest data to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">3. Cookies & Security</h2>
            <p>
              Authentication relies on HttpOnly, SameSite cookies to protect your session against XSS and token theft. We do not store secret tokens in localStorage.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">4. Data Deletion & Rights</h2>
            <p>
              You maintain total control over your wedding data. You can export your records to CSV at any time, delete individual weddings, or initiate permanent account deletion from your profile settings.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base text-[#8B1D3B] mb-1">5. Contact Us</h2>
            <p>For privacy inquiries or data requests, contact privacy@shaadiplanner.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
