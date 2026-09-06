import { useState } from "react"

interface LandingPageProps {
  onNavigateToAuth: (mode: "login" | "register") => void
  onNavigateToLegal: (page: "privacy" | "terms") => void
}

export default function LandingPage({ onNavigateToAuth, onNavigateToLegal }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const SERVICES = [
    { icon: "🏠", title: "Smart Dashboard", desc: "Real-time countdown, budget utilization, guest RSVP metrics, and upcoming function alerts." },
    { icon: "💰", title: "Budget Planner", desc: "Category-wise expense allocation, estimated vs actual spend, and vendor payment milestones." },
    { icon: "👥", title: "Guest List Manager", desc: "Track RSVPs, Bride/Groom sides, dietary preferences, and plus-ones seamlessly." },
    { icon: "🪑", title: "Seating Planner", desc: "Design table capacities and assign guests without seat overlap or double bookings." },
    { icon: "🤝", title: "Vendor Directory", desc: "Shortlist, hire, and track payments for caterers, venue, decorators, and photographers." },
    { icon: "📅", title: "Event Timeline", desc: "Schedule Haldi, Mehendi, Sangeet, Baraat, Vivah, and Reception with dresscodes & venues." },
    { icon: "✅", title: "Smart Checklist", desc: "Pre-loaded with essential Indian wedding tasks categorized by priority and timeframe." },
    { icon: "🎁", title: "Shagun & Gift Tracker", desc: "Private financial ledger for recording cash gifts and returns per wedding function." },
    { icon: "🍽️", title: "Menu Builder", desc: "Organize appetizers, live counters, main courses, and desserts with dietary tags." },
    { icon: "📝", title: "Wedding Notes", desc: "Keep venue contacts, song playlists, and family reminders organized in one hub." },
  ]

  const FAQS = [
    { q: "Is Shaadi Planner free to use?", a: "Yes! Shaadi Planner offers a comprehensive free plan with access to all 10 core wedding planning modules." },
    { q: "Can I access my wedding plan from my mobile phone?", a: "Absolutely. Shaadi Planner is fully responsive and accessible across iOS, Android, tablets, and desktop browsers." },
    { q: "Is my wedding data safely stored in the cloud?", a: "Yes. All your budget calculations, guest lists, and notes are securely stored in PostgreSQL with encrypted session auth." },
    { q: "Can I manage multiple wedding functions like Mehendi & Sangeet?", a: "Yes! You can customize timelines, venues, dresscodes, and budgets for Haldi, Mehendi, Sangeet, Vivah, Reception, and custom ceremonies." },
    { q: "Can I export my guest list or budget to CSV?", a: "Yes. You can export guest lists, vendor balances, budget summaries, and function schedules to CSV at any time." },
    { q: "How do I migrate my existing local data?", a: "Shaadi Planner automatically detects any locally saved browser data upon login and seamlessly imports it to your cloud account." },
  ]

  return (
    <div className="min-h-screen bg-[#FCF8F2] text-[#1A1617] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#5C0F24]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#1D060D]/90 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A1631] to-[#400A19] border border-[#D4AF37]/50 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
              💍
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-white">
                SHAADI <span className="gold-gradient-text">PLANNER</span>
              </span>
              <span className="block text-[9px] text-[#E5C358]/80 font-medium tracking-[0.2em] uppercase -mt-0.5">
                Royal Indian Wedding SaaS
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-[#FCF8F2]/80 uppercase">
            <button onClick={() => scrollToSection("services")} className="hover:text-[#E5C358] transition-colors cursor-pointer">Modules</button>
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-[#E5C358] transition-colors cursor-pointer">Workflow</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#E5C358] transition-colors cursor-pointer">Why Us</button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-[#E5C358] transition-colors cursor-pointer">FAQ</button>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigateToAuth("login")}
              className="text-xs font-semibold tracking-wider uppercase px-4 py-2 text-[#FCF8F2] hover:text-[#E5C358] transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigateToAuth("register")}
              className="luxury-button-gold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#E5C358] text-2xl focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1D060D] px-6 py-6 space-y-4 border-t border-[#D4AF37]/20 text-xs font-medium uppercase tracking-wider text-[#FCF8F2]">
            <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 hover:text-[#E5C358]">Modules</button>
            <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left py-2 hover:text-[#E5C358]">Workflow</button>
            <button onClick={() => scrollToSection("comparison")} className="block w-full text-left py-2 hover:text-[#E5C358]">Why Us</button>
            <button onClick={() => scrollToSection("faq")} className="block w-full text-left py-2 hover:text-[#E5C358]">FAQ</button>
            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col gap-3">
              <button
                onClick={() => onNavigateToAuth("login")}
                className="w-full text-center py-2.5 rounded-xl border border-[#D4AF37]/40 text-[#FCF8F2]"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigateToAuth("register")}
                className="w-full text-center py-2.5 luxury-button-gold rounded-xl font-bold text-slate-950"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1D060D] via-[#3D0A19] to-[#FCF8F2] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle Decorative Pattern Layer */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* LEFT COLUMN: Messaging & Action */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 bg-[#5C0F24]/60 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-[#E5C358] text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-inner">
              <span>👑</span>
              <span>The Royal Indian Wedding SaaS</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Plan Your Perfect Shaadi. <br />
              <span className="gold-gradient-text font-cinzel">Without the Chaos.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#FCF8F2]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Unify your budget, guest RSVPs, vendor bookings, seating arrangements, function timelines, menu courses, and gift tracking into one luxury cloud platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigateToAuth("register")}
                className="w-full sm:w-auto luxury-button-gold px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer"
              >
                Start Planning Free 🎉
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="w-full sm:w-auto bg-[#5C0F24]/50 hover:bg-[#5C0F24]/80 text-[#FCF8F2] font-semibold px-7 py-4 rounded-xl text-sm border border-[#D4AF37]/30 transition-all backdrop-blur-md cursor-pointer"
              >
                Explore All 10 Modules
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#D4AF37]/20 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-xs font-bold text-[#E5C358]">10 Modules</div>
                <div className="text-[11px] text-[#FCF8F2]/60">Complete Wedding Suite</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#E5C358]">PostgreSQL</div>
                <div className="text-[11px] text-[#FCF8F2]/60">Encrypted Cloud Storage</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#E5C358]">100% Free</div>
                <div className="text-[11px] text-[#FCF8F2]/60">Full Access Included</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Royal Wedding Visual + Floating Preview Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Cinematic Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl group">
                <img
                  src="/images/royal_wedding_hero.jpg"
                  alt="Luxury Royal Indian Wedding Ceremony Mandap Venue"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D060D] via-[#1D060D]/20 to-transparent" />
              </div>

              {/* FLOATING DEMO DASHBOARD CARD OVERLAY */}
              <div className="absolute -bottom-8 left-4 right-4 sm:left-6 sm:right-6 bg-[#1D060D]/95 border border-[#D4AF37]/40 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-slow">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-3">
                  <div>
                    <h3 className="font-playfair text-sm sm:text-base font-bold text-white">
                      Aarav & Ananya's Wedding Command Center
                    </h3>
                    <p className="text-[11px] text-[#E5C358]/80">December 15, 2026 • Udaipur Palace</p>
                  </div>
                  <span className="bg-[#7A1631] text-[#E5C358] border border-[#D4AF37]/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                    ⏳ 101 Days Left
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
                  <div className="bg-[#2D0B16] p-2.5 rounded-xl border border-[#D4AF37]/20">
                    <div className="text-[9px] uppercase font-semibold tracking-wider text-[#FCF8F2]/60">Total Budget</div>
                    <div className="text-xs font-bold text-[#E5C358] mt-0.5">₹25,00,000</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">₹18,50,000 Spent</div>
                  </div>
                  <div className="bg-[#2D0B16] p-2.5 rounded-xl border border-[#D4AF37]/20">
                    <div className="text-[9px] uppercase font-semibold tracking-wider text-[#FCF8F2]/60">Guest RSVPs</div>
                    <div className="text-xs font-bold text-[#E5C358] mt-0.5">240 / 300</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">80% Confirmed</div>
                  </div>
                  <div className="bg-[#2D0B16] p-2.5 rounded-xl border border-[#D4AF37]/20">
                    <div className="text-[9px] uppercase font-semibold tracking-wider text-[#FCF8F2]/60">Vendors</div>
                    <div className="text-xs font-bold text-[#E5C358] mt-0.5">7 / 9 Booked</div>
                    <div className="text-[9px] text-amber-300 mt-0.5">Venue & Catering ✓</div>
                  </div>
                  <div className="bg-[#2D0B16] p-2.5 rounded-xl border border-[#D4AF37]/20">
                    <div className="text-[9px] uppercase font-semibold tracking-wider text-[#FCF8F2]/60">Checklist</div>
                    <div className="text-xs font-bold text-[#E5C358] mt-0.5">14 / 20 Done</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">70% Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="py-14 bg-white border-y border-[#EAE0D5] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF8F2] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mx-auto shadow-sm">
              🏰
            </div>
            <div className="font-playfair text-base font-bold text-[#7A1631]">Single Source of Truth</div>
            <p className="text-xs text-[#75676B] leading-relaxed">No more scattered chat threads, physical registers, or lost spreadsheets.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF8F2] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mx-auto shadow-sm">
              ⚡
            </div>
            <div className="font-playfair text-base font-bold text-[#7A1631]">Real-Time Sync</div>
            <p className="text-xs text-[#75676B] leading-relaxed">Instant updates across mobile browsers, tablets, and desktop computers.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF8F2] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mx-auto shadow-sm">
              👨‍👩‍👧‍👦
            </div>
            <div className="font-playfair text-base font-bold text-[#7A1631]">Family Collaboration</div>
            <p className="text-xs text-[#75676B] leading-relaxed">Share viewable wedding itineraries, seating plans, and functions effortlessly.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF8F2] border border-[#D4AF37]/40 flex items-center justify-center text-2xl mx-auto shadow-sm">
              🔒
            </div>
            <div className="font-playfair text-base font-bold text-[#7A1631]">Encrypted Privacy</div>
            <p className="text-xs text-[#75676B] leading-relaxed">PostgreSQL data isolation with secure session management.</p>
          </div>
        </div>
      </section>

      {/* CORE 10 MODULES GRID */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-block text-xs font-bold tracking-widest text-[#7A1631] uppercase bg-[#F3E5AB]/40 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
            Comprehensive Wedding Suite
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1617]">
            All 10 Essential Wedding Modules
          </h2>
          <p className="text-sm text-[#75676B] max-w-2xl mx-auto">
            From initial engagement and budget planning to Haldi, Mehendi, Sangeet, Vivah, and post-wedding Shagun records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="luxury-card p-6 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCF8F2] border border-[#D4AF37]/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="font-playfair text-lg font-bold text-[#7A1631] group-hover:text-[#5C0F24] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-[#75676B] leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#EAE0D5] flex items-center justify-between text-xs font-semibold text-[#7A1631]">
                <span>Explore Feature</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section id="how-it-works" className="py-20 bg-[#1D060D] text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-14 relative z-10">
          <div className="space-y-3">
            <div className="inline-block text-xs font-bold tracking-widest text-[#E5C358] uppercase bg-[#5C0F24]/80 px-3.5 py-1 rounded-full border border-[#D4AF37]/30">
              Seamless 4-Step Process
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
              How Shaadi Planner Works
            </h2>
            <p className="text-sm text-[#FCF8F2]/70 max-w-xl mx-auto">
              Designed specifically around Indian wedding traditions, multi-day ceremonies, and family structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="bg-[#2D0B16] p-6 rounded-2xl border border-[#D4AF37]/20 relative">
              <div className="text-2xl font-bold text-[#D4AF37] font-cinzel mb-3">01</div>
              <h3 className="font-playfair text-base font-bold text-white mb-2">Create Your Wedding</h3>
              <p className="text-xs text-[#FCF8F2]/70 leading-relaxed">Enter wedding dates, estimated guest count, overall budget, and city tier.</p>
            </div>

            <div className="bg-[#2D0B16] p-6 rounded-2xl border border-[#D4AF37]/20 relative">
              <div className="text-2xl font-bold text-[#D4AF37] font-cinzel mb-3">02</div>
              <h3 className="font-playfair text-base font-bold text-white mb-2">Manage Guests & Seating</h3>
              <p className="text-xs text-[#FCF8F2]/70 leading-relaxed">Categorize RSVPs by Bride/Groom side, meal preference, and table assignments.</p>
            </div>

            <div className="bg-[#2D0B16] p-6 rounded-2xl border border-[#D4AF37]/20 relative">
              <div className="text-2xl font-bold text-[#D4AF37] font-cinzel mb-3">03</div>
              <h3 className="font-playfair text-base font-bold text-white mb-2">Track Vendors & Budget</h3>
              <p className="text-xs text-[#FCF8F2]/70 leading-relaxed">Keep track of quotes, advance deposits, remaining dues, and catering menus.</p>
            </div>

            <div className="bg-[#2D0B16] p-6 rounded-2xl border border-[#D4AF37]/20 relative">
              <div className="text-2xl font-bold text-[#D4AF37] font-cinzel mb-3">04</div>
              <h3 className="font-playfair text-base font-bold text-white mb-2">Execute & Record Shagun</h3>
              <p className="text-xs text-[#FCF8F2]/70 leading-relaxed">Share function itineraries with family and log cash gifts during events securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SHAADI PLANNER COMPARISON */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1617]">
            Why Modern Couples Choose Shaadi Planner
          </h2>
          <p className="text-sm text-[#75676B]">
            Say goodbye to disorganized WhatsApp groups and confusing notebook entries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Method */}
          <div className="bg-rose-50/50 p-8 rounded-2xl border border-rose-200 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <span>⚠️</span> Traditional Planning Methods
            </div>
            <ul className="space-y-3 text-xs text-rose-950/80 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Scattered budget notes in multiple notebooks and phone messaging apps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Duplicate guest entries and unconfirmed dietary preferences.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Missed vendor payment deadlines and unrecorded cash deposits.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Confusing seating arrangements leading to last-minute venue chaos.</span>
              </li>
            </ul>
          </div>

          {/* Shaadi Planner Method */}
          <div className="bg-[#FCF8F2] p-8 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#7A1631] flex items-center gap-2">
              <span>👑</span> Shaadi Planner Platform
            </div>
            <ul className="space-y-3 text-xs text-[#1A1617] leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Unified cloud platform accessible anywhere with instant data sync.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Structured guest RSVP management with Bride/Groom side filters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Automated budget tracking, vendor balances, and payment reminders.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Dedicated Shagun gift tracker, menu builder, and ceremonial timelines.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white border-t border-[#EAE0D5] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1A1617]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#75676B]">
              Everything you need to know about getting started with Shaadi Planner.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="luxury-card overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#7A1631] hover:text-[#5C0F24] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-bold text-[#D4AF37]">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#75676B] leading-relaxed border-t border-[#EAE0D5] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-20 bg-gradient-to-br from-[#1D060D] via-[#3D0A19] to-[#1D060D] text-white px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight">
            Ready to Plan Your Dream Wedding?
          </h2>
          <p className="text-sm sm:text-base text-[#FCF8F2]/80 max-w-xl mx-auto">
            Join couples organizing their perfect Indian wedding celebration with Shaadi Planner.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigateToAuth("register")}
              className="luxury-button-gold px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              Create Free Account Now 🎉
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1D060D] text-[#FCF8F2]/70 py-12 border-t border-[#D4AF37]/20 text-xs px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-cinzel text-lg font-bold text-white tracking-wider">
              SHAADI <span className="gold-gradient-text">PLANNER</span>
            </div>
            <p className="text-[11px] text-[#FCF8F2]/50">Royal Indian Wedding SaaS Platform</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#FCF8F2]/80 font-medium">
            <button onClick={() => onNavigateToLegal("privacy")} className="hover:text-[#E5C358] transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => onNavigateToLegal("terms")} className="hover:text-[#E5C358] transition-colors cursor-pointer">Terms of Service</button>
          </div>

          <div className="text-[11px] text-[#FCF8F2]/50">
            © {new Date().getFullYear()} Shaadi Planner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
