import { useState } from "react"
import { shareApi } from "../api"

interface ShareModalProps {
  weddingId: string
  onClose: () => void
}

export default function ShareModal({ weddingId, onClose }: ShareModalProps) {
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const res = await shareApi.createLink(weddingId)
    setLoading(false)

    if (res.success && res.data) {
      setShareUrl(res.data.shareUrl)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#1D060D]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="luxury-card max-w-md w-full p-6 sm:p-8 space-y-5 animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-[#EAE0D5] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔗</span>
            <h3 className="font-playfair text-lg font-bold text-[#7A1631]">Share Wedding Itinerary</h3>
          </div>
          <button onClick={onClose} className="text-[#75676B] hover:text-[#1A1617] font-bold text-sm cursor-pointer">✕</button>
        </div>

        <p className="text-xs text-[#75676B] leading-relaxed font-medium">
          Generate a secure, read-only share link. Family members and guests with this link can view ceremony timelines, venues, dress codes, and menus without accessing private financial notes or budgets.
        </p>

        {shareUrl ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 bg-[#FCF8F2] border border-[#EAE0D5] p-3 rounded-xl text-xs text-[#1A1617] break-all">
              <span className="flex-1 truncate font-mono">{shareUrl}</span>
              <button
                onClick={copyToClipboard}
                className="luxury-button-primary px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                {copied ? "Copied! ✓" : "Copy Link"}
              </button>
            </div>
            <p className="text-[11px] text-[#75676B]">Share link active for read-only guest access.</p>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full luxury-button-primary font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? "Generating Secure Token..." : "Generate Share Link ✨"}
          </button>
        )}
      </div>
    </div>
  )
}
