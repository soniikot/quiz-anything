import { Brain, Target, Trophy } from 'lucide-react'

type StatsGridProps = {
  totalQuizzes: number
  averageScore: number
  unreviewedQuestionsCount: number
}

export default function StatsGrid({
  totalQuizzes,
  averageScore,
  unreviewedQuestionsCount,
}: StatsGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Quizzes</p>
            <p className="text-3xl font-bold text-white">{totalQuizzes}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Score</p>
            <p className="text-3xl font-bold text-white">{averageScore}%</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">To Review</p>
            <p className="text-3xl font-bold text-white">
              {unreviewedQuestionsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
