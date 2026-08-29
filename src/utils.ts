export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  return `₹${Math.round(amount)}`
}

export function formatINRFull(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

export const inp =
  "w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1D3B]/25 focus:border-[#8B1D3B] bg-[#FFFBF5] transition-colors placeholder:text-[#C4A882]"

export const btnPrimary =
  "bg-[#8B1D3B] hover:bg-[#6B1530] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors active:scale-95"

export const btnGhost =
  "text-[#9B8B7A] hover:text-red-500 transition-colors text-xl leading-none"

export const card = "bg-white rounded-2xl shadow-sm border border-[#E8D5B7]"

export const sectionHead = (title: string, hindi: string) =>
  ({ title, hindi })
