import { Link } from '@tanstack/react-router'
import { Brain } from 'lucide-react'

type ReviewCTAProps = {
  unreviewedQuestionsCount: number
}

export default function ReviewCTA({
  unreviewedQuestionsCount,
}: ReviewCTAProps) {
  if (unreviewedQuestionsCount === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8 mb-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to Review?
          </h3>
          <p className="text-gray-300 mb-4">
            You have {unreviewedQuestionsCount} questions waiting for review
          </p>

          <Link
            to="/review-quiz"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50"
          >
            Start Review Quiz
          </Link>
        </div>
        <Brain className="w-24 h-24 text-cyan-400 opacity-20" />
      </div>
    </div>
  )
}
