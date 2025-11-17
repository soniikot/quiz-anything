import { Hash, Link as LinkIcon, Loader2 } from 'lucide-react'

type QuizGeneratorFormProps = {
  url: string
  numberOfQuestions: number
  loading: boolean
  error: string | null
  onUrlChange: (url: string) => void
  onNumberOfQuestionsChange: (num: number) => void
  onGenerate: () => void
}

export default function QuizGeneratorForm({
  url,
  numberOfQuestions,
  loading,
  error,
  onUrlChange,
  onNumberOfQuestionsChange,
  onGenerate,
}: QuizGeneratorFormProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-12">
      <h3 className="text-2xl font-bold text-white mb-4">Generate New Quiz</h3>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL
          </label>
          <div className="relative">
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
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Questions (1-20)
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={numberOfQuestions}
              onChange={(e) =>
                onNumberOfQuestionsChange(Number(e.target.value))
              }
              placeholder="5"
              min="1"
              max="20"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={loading}
            />
          </div>
        </div>
        <button
          onClick={onGenerate}
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
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
