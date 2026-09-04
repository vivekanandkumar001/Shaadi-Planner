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
    { icon: "🏠", title: "Smart Dashboard", desc: "Real-time countdown, budget utilization, guest RSVP tracking, and upcoming task alerts." },
    { icon: "💰", title: "Budget Planner", desc: "Category-wise expense allocations, estimated vs actual spend, and payment due dates." },
    { icon: "👥", title: "Guest List Manager", desc: "Track RSVP statuses, side (Bride/Groom), dietary preferences, and plus-ones." },
    { icon: "🪑", title: "Seating Planner", desc: "Design table capacities and assign guests seamlessly without duplicates." },
    { icon: "🤝", title: "Vendor Directory", desc: "Shortlist, book, and track payments for caterers, photographers, decorators, and DJs." },
    { icon: "📅", title: "Event Timeline", desc: "Schedule Haldi, Mehendi, Sangeet, Baraat, Vivah, and Reception details with dresscodes." },
    { icon: "✅", title: "Smart Checklist", desc: "Pre-loaded with 20+ essential Indian wedding tasks categorized by priority." },
    { icon: "🎁", title: "Shagun & Gift Tracker", desc: "Record cash gifts and returns per event with full financial privacy." },
    { icon: "🍽️", title: "Menu Builder", desc: "Organize appetizers, live counters, main courses, and desserts with dietary tags." },
    { icon: "📝", title: "Wedding Notes", desc: "Keep venue contacts, song lists, and family reminders in one place." },
  ]

  const FAQS = [
    { q: "Is Shaadi Planner free to use?", a: "Yes! Shaadi Planner offers a comprehensive free plan with access to all 10 wedding planning modules." },
    { q: "Can I access my wedding plan from my mobile phone?", a: "Absolutly. Shaadi Planner is fully responsive and accessible on iOS, Android, tablets, and desktop browsers." },
    { q: "Is my wedding data safely saved in the cloud?", a: "Yes. All your budget details, guest lists, and notes are securely stored in PostgreSQL with HttpOnly encrypted authentication." },
    { q: "Can I manage multiple wedding functions like Mehendi & Sangeet?", a: "Yes! You can customize timelines, venues, dresscodes, and budgets for Haldi, Mehendi, Sangeet, Vivah, Reception, and custom events." },
    { q: "Can I export my guest list or budget to CSV?", a: "Yes. You can export your guest list, vendor records, budget summary, and function schedules to CSV at any time." },
    { q: "How do I migrate my existing plan if I used Shaadi Planner before?", a: "Shaadi Planner automatically detects any locally saved browser data upon login and imports it to your cloud account seamlessly." },
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2C1810] flex flex-col font-sans">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#3A0C1A] text-white border-b border-amber-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-full bg-[#8B1D3B] border border-amber-400/40 flex items-center justify-center text-lg">
              💍
            </div>
            <div>
              <span className="font-playfair text-xl font-bold tracking-wide">
                Shaadi <span className="text-[#D4900A]">Planner</span>
              </span>
              <span className="block text-[9px] text-amber-200/70 font-light -mt-1 tracking-widest uppercase">
                Premium Indian Wedding Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-amber-100/90">
            <button onClick={() => scrollToSection("services")} className="hover:text-[#D4900A] transition-colors">Services</button>
            <button onClick={() => scrollToSection("how-it-works")} className="hover:text-[#D4900A] transition-colors">How It Works</button>
            <button onClick={() => scrollToSection("comparison")} className="hover:text-[#D4900A] transition-colors">Why Shaadi Planner</button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-[#D4900A] transition-colors">FAQ</button>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigateToAuth("login")}
              className="text-xs font-medium px-4 py-2 text-amber-100 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigateToAuth("register")}
              className="bg-[#D4900A] hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-md active:scale-95"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-amber-200 text-2xl focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2C0914] px-4 py-4 space-y-3 border-t border-amber-900/40 text-xs">
            <button onClick={() => scrollToSection("services")} className="block w-full text-left py-1.5 text-amber-100">Services</button>
            <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left py-1.5 text-amber-100">How It Works</button>
            <button onClick={() => scrollToSection("comparison")} className="block w-full text-left py-1.5 text-amber-100">Why Shaadi Planner</button>
            <button onClick={() => scrollToSection("faq")} className="block w-full text-left py-1.5 text-amber-100">FAQ</button>
            <div className="pt-2 border-t border-amber-900/40 flex flex-col gap-2">
              <button
                onClick={() => onNavigateToAuth("login")}
                className="w-full text-center py-2 rounded border border-amber-500/30 text-amber-100"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigateToAuth("register")}
                className="w-full text-center py-2 bg-[#D4900A] text-slate-950 font-bold rounded"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3A0C1A] via-[#501124] to-[#FFFBF5] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-medium backdrop-blur-sm">
            ✨ Complete Indian Wedding Planning SaaS
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Plan Your Perfect Shaadi. <br />
            <span className="text-[#D4900A]">Without the Chaos.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-amber-100/80 font-light leading-relaxed">
            Bring budget, guest RSVPs, vendor bookings, seating arrangements, function timelines, menu courses, and gift tracking into one elegant cloud platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateToAuth("register")}
              className="w-full sm:w-auto bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-xl hover:shadow-2xl transition-all border border-amber-400/30 active:scale-95"
            >
              Start Planning Free 🎉
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-all backdrop-blur-sm"
            >
              Explore All 10 Services
            </button>
          </div>

          {/* DASHBOARD PREVIEW CARD MOCKUP */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-[#2C0914]/90 p-3 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-md">
              <div className="bg-white rounded-xl p-4 sm:p-6 text-left text-slate-800 shadow-inner">
                <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-2">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#8B1D3B]">Aarav & Ananya's Wedding Dashboard</h3>
                    <p className="text-xs text-slate-500">December 15, 2026 • New Delhi</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold border border-amber-300">
                    ⏳ 101 Days Remaining
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-[#FDF6EC] p-3 rounded-lg border border-[#E8D5B7]">
                    <div className="text-[10px] text-slate-500 font-medium">TOTAL BUDGET</div>
                    <div className="text-sm font-bold text-[#8B1D3B]">₹25,00,000</div>
                    <div className="text-[10px] text-emerald-600 mt-1">₹18,50,000 spent</div>
                  </div>
                  <div className="bg-[#FDF6EC] p-3 rounded-lg border border-[#E8D5B7]">
                    <div className="text-[10px] text-slate-500 font-medium">GUEST RSVPs</div>
                    <div className="text-sm font-bold text-[#8B1D3B]">240 / 300</div>
                    <div className="text-[10px] text-amber-700 mt-1">80% Confirmed</div>
                  </div>
                  <div className="bg-[#FDF6EC] p-3 rounded-lg border border-[#E8D5B7]">
                    <div className="text-[10px] text-slate-500 font-medium">VENDORS BOOKED</div>
                    <div className="text-sm font-bold text-[#8B1D3B]">7 / 9</div>
                    <div className="text-[10px] text-emerald-600 mt-1">Venue & Catering ✓</div>
                  </div>
                  <div className="bg-[#FDF6EC] p-3 rounded-lg border border-[#E8D5B7]">
                    <div className="text-[10px] text-slate-500 font-medium">TASKS COMPLETED</div>
                    <div className="text-sm font-bold text-[#8B1D3B]">14 / 20</div>
                    <div className="text-[10px] text-amber-700 mt-1">70% Finished</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE HIGHLIGHTS */}
      <section className="py-12 bg-white border-b border-amber-200/60 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-2xl mb-1">🏰</div>
            <div className="text-sm font-bold text-[#8B1D3B]">Everything in One Place</div>
            <div className="text-xs text-slate-500 mt-1">No more scattered notes or lost chat messages.</div>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm font-bold text-[#8B1D3B]">Real-Time Progress</div>
            <div className="text-xs text-slate-500 mt-1">Instant updates across all devices.</div>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
            <div className="text-sm font-bold text-[#8B1D3B]">Family Friendly</div>
            <div className="text-xs text-slate-500 mt-1">Share timelines & seating plans effortlessly.</div>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-sm font-bold text-[#8B1D3B]">Secure Cloud Storage</div>
            <div className="text-xs text-slate-500 mt-1">PostgreSQL encryption and session security.</div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-[#8B1D3B]">
            All 10 Core Wedding Planning Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need for Haldi, Mehendi, Sangeet, Baraat, Vivah, and Reception.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E8D5B7] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FDF6EC] flex items-center justify-center text-xl border border-amber-300/40">
                {s.icon}
              </div>
              <h3 className="font-playfair text-base font-bold text-[#8B1D3B]">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-[#3A0C1A] text-white px-4">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-white">How Shaadi Planner Works</h2>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-2">From initial engagement to the big reception in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white/5 p-5 rounded-xl border border-amber-400/20 backdrop-blur-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#D4900A] text-slate-950 font-bold flex items-center justify-center text-sm">1</div>
              <h3 className="font-semibold text-sm text-white">Create Your Wedding</h3>
              <p className="text-xs text-amber-100/70">Set couple names, wedding date, city, estimated budget, and guest count.</p>
            </div>
            <div className="bg-white/5 p-5 rounded-xl border border-amber-400/20 backdrop-blur-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#D4900A] text-slate-950 font-bold flex items-center justify-center text-sm">2</div>
              <h3 className="font-semibold text-sm text-white">Add Events & Guests</h3>
              <p className="text-xs text-amber-100/70">Input your Haldi, Mehendi, and Sangeet functions along with your guest lists.</p>
            </div>
            <div className="bg-white/5 p-5 rounded-xl border border-amber-400/20 backdrop-blur-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#D4900A] text-slate-950 font-bold flex items-center justify-center text-sm">3</div>
              <h3 className="font-semibold text-sm text-white">Book Vendors & Menu</h3>
              <p className="text-xs text-amber-100/70">Track caterers, venue payments, photographers, and multi-course food menus.</p>
            </div>
            <div className="bg-white/5 p-5 rounded-xl border border-amber-400/20 backdrop-blur-sm space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#D4900A] text-slate-950 font-bold flex items-center justify-center text-sm">4</div>
              <h3 className="font-semibold text-sm text-white">Track & Celebrate</h3>
              <p className="text-xs text-amber-100/70">Monitor completion percentages, seating allocations, and shagun gifts live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE COMPARISON */}
      <section id="comparison" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#8B1D3B]">
            Why Upgrade From Spreadsheets & WhatsApp?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">Built specifically for the unique workflow of Indian weddings.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-sm overflow-hidden text-xs sm:text-sm">
          <div className="grid grid-cols-3 bg-[#3A0C1A] text-white p-3 font-semibold text-center">
            <div>Feature</div>
            <div>Excel / WhatsApp</div>
            <div className="text-[#D4900A]">Shaadi Planner</div>
          </div>
          <div className="divide-y divide-amber-100">
            <div className="grid grid-cols-3 p-3 text-center items-center">
              <div className="font-medium text-slate-800 text-left">Indian Wedding Functions</div>
              <div className="text-rose-600">Manual tables</div>
              <div className="text-emerald-700 font-bold">Built-in (Haldi to Vivah) ✓</div>
            </div>
            <div className="grid grid-cols-3 p-3 text-center items-center bg-[#FFFBF5]">
              <div className="font-medium text-slate-800 text-left">RSVP & Meal Preferences</div>
              <div className="text-rose-600">Scattered WhatsApp chats</div>
              <div className="text-emerald-700 font-bold">Veg / Non-Veg / Jain tracking ✓</div>
            </div>
            <div className="grid grid-cols-3 p-3 text-center items-center">
              <div className="font-medium text-slate-800 text-left">Seating Capacity Validation</div>
              <div className="text-rose-600">No warnings</div>
              <div className="text-emerald-700 font-bold">Server-enforced table limits ✓</div>
            </div>
            <div className="grid grid-cols-3 p-3 text-center items-center bg-[#FFFBF5]">
              <div className="font-medium text-slate-800 text-left">Shagun & Gift Record</div>
              <div className="text-rose-600">Lost notebooks</div>
              <div className="text-emerald-700 font-bold">Private financial logs ✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO TESTIMONIAL PLACEHOLDERS */}
      <section className="py-16 bg-[#FDF6EC] border-t border-b border-amber-200/60 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#8B1D3B]">Loved by Couples & Families</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-5 rounded-xl border border-amber-300/40 shadow-sm space-y-2">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-slate-600 italic">"Managing 400 guests and 6 functions was effortless. The seating planner and meal preference filters saved us so much time!"</p>
              <div className="text-xs font-bold text-[#8B1D3B] pt-2">— Vikram & Priya, New Delhi <span className="text-[10px] text-slate-400 font-normal">(Demo Feedback)</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-amber-300/40 shadow-sm space-y-2">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-slate-600 italic">"The vendor budget breakdown helped us stay under our ₹30 Lakh cap. We could track every token payment."</p>
              <div className="text-xs font-bold text-[#8B1D3B] pt-2">— Rohan & Meera, Mumbai <span className="text-[10px] text-slate-400 font-normal">(Demo Feedback)</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-amber-300/40 shadow-sm space-y-2">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-slate-600 italic">"Our family loved being able to check the function timelines and menu choices without having to ask us repeatedly!"</p>
              <div className="text-xs font-bold text-[#8B1D3B] pt-2">— Sneha & Arjun, Bengaluru <span className="text-[10px] text-slate-400 font-normal">(Demo Feedback)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#8B1D3B]">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-600">Everything you need to know about Shaadi Planner.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-[#E8D5B7] overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 font-semibold text-xs sm:text-sm text-[#8B1D3B] flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <span className="text-amber-700">{activeFaq === idx ? "−" : "+"}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 border-t border-amber-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-[#3A0C1A] text-white text-center px-4 space-y-6">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
          Your Shaadi. Your Plan. <span className="text-[#D4900A]">One Place.</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-100/70 max-w-lg mx-auto">
          Start organizing your wedding today. Free registration with secure cloud persistence.
        </p>
        <div>
          <button
            onClick={() => onNavigateToAuth("register")}
            className="bg-[#D4900A] hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-xl transition-all active:scale-95"
          >
            Create Your Free Account Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2C0914] text-amber-200/70 py-10 border-t border-amber-900/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-playfair text-white text-sm font-bold mb-3">Shaadi Planner</h4>
            <p className="text-[11px] text-amber-100/60 leading-relaxed">
              The premier cloud wedding planning platform for Indian couples and families.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Dashboard & Analytics</li>
              <li>Budget & Expenses</li>
              <li>Guest RSVPs</li>
              <li>Seating & Vendors</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Legal & Security</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigateToLegal("privacy")} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => onNavigateToLegal("terms")} className="hover:text-white">Terms of Service</button></li>
              <li>Cookie Security</li>
              <li>Data Protection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <p className="text-[11px] text-amber-100/60">support@shaadiplanner.com</p>
            <p className="text-[11px] text-amber-100/60 mt-1">Render Cloud Deployment Ready</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center border-t border-amber-900/40 pt-4 text-[10px] text-amber-200/40">
          © {new Date().getFullYear()} Shaadi Planner. All rights reserved. Designed for Indian Weddings.
        </div>
      </footer>
    </div>
  )
}
