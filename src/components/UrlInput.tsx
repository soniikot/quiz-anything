import { Link as LinkIcon, Loader2 } from 'lucide-react'

type UrlInputProps = {
  url: string
  loading: boolean
  onUrlChange: (url: string) => void
  onGenerate: () => void
}

export default function UrlInput({
  url,
  loading,
  onUrlChange,
  onGenerate,
}: UrlInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate()
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8 shadow-2xl">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Enter webpage URL
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!url || loading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50 disabled:shadow-none flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
