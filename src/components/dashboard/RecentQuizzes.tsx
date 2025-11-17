import { BarChart3, Calendar } from 'lucide-react'

type QuizAttempt = {
  quizTitle: string
  completedAt: number
  correctAnswers: number
  totalQuestions: number
  score: number
}

type RecentQuizzesProps = {
  recentAttempts: Array<QuizAttempt>
}

export default function RecentQuizzes({ recentAttempts }: RecentQuizzesProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Recent Quizzes</h2>
      </div>

      {recentAttempts.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No quizzes yet. Take your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAttempts.map((attempt, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">
                    {attempt.quizTitle}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(attempt.completedAt).toLocaleDateString()} •{' '}
                    {attempt.correctAnswers}/{attempt.totalQuestions} correct
                  </p>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    attempt.score >= 70
                      ? 'text-green-400'
                      : attempt.score >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {Math.round(attempt.score)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
