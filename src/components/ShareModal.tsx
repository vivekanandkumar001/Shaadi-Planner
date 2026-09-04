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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            <h3 className="font-playfair text-base font-bold text-[#8B1D3B]">Share Wedding Overview</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Generate a safe, random share token link. Anyone with this link can view your wedding timeline, venue, and menu options without accessing private financial notes or guest passwords.
        </p>

        {shareUrl ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 bg-[#FFFBF5] border border-[#E8D5B7] p-2.5 rounded-lg text-xs font-mono text-slate-700 break-all">
              <span className="flex-1 truncate">{shareUrl}</span>
              <button
                onClick={copyToClipboard}
                className="bg-[#8B1D3B] text-white px-3 py-1.5 rounded font-sans text-xs font-medium"
              >
                {copied ? "Copied! ✓" : "Copy Link"}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">Link valid for 30 days. You can revoke it anytime.</p>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#8B1D3B] hover:bg-[#6B1530] text-white py-3 rounded-lg text-xs font-medium shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Generating Secure Token..." : "Generate Share Link ✨"}
          </button>
        )}
      </div>
    </div>
  )
}
