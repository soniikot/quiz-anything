import { Link } from "@tanstack/react-router"
import { CheckCircle2, XCircle } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import type { Quiz } from "@/api/quiz"

type QuizResultsProps = {
  quiz: Quiz
  userAnswers: Array<number | null>
  score: number
  onTryAgain: () => void
}

export default function QuizResults({
  quiz,
  userAnswers,
  score,
  onTryAgain,
}: QuizResultsProps) {
  const { isSignedIn } = useUser()
  const percentage = (score / quiz.questions.length) * 100

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
        <div className="text-6xl font-black mb-4">
          <span
            className={
              percentage >= 70
                ? 'text-green-400'
                : percentage >= 50
                  ? 'text-yellow-400'
                  : 'text-red-400'
            }
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
        <p className="text-xl text-gray-300">
          You got {score} out of {quiz.questions.length} questions correct
        </p>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6 mb-8">
        {quiz.questions.map((question, index) => {
          const userAnswer = userAnswers[index]
          const isCorrect = userAnswer === question.correctAnswer

          return (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 ${
                isCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {index + 1}. {question.question}
                  </h3>

                  {!isCorrect && userAnswer !== null && (
                    <div className="mb-2 p-3 bg-red-500/20 rounded border border-red-500/50">
                      <p className="text-sm text-red-300 mb-1">Your answer:</p>
                      <p className="text-white">
                        {question.options[userAnswer]}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-green-500/20 rounded border border-green-500/50">
                    <p className="text-sm text-green-300 mb-1">
                      Correct answer:
                    </p>
                    <p className="text-white">
                      {question.options[question.correctAnswer]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center space-x-4">
        <Link to={isSignedIn ? "/dashboard" : "/"}>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg shadow-cyan-500/50">
            {isSignedIn ? "Return to Dashboard" : "Create Another Quiz"}
          </button>
        </Link>
      </div>
    </div>
  )
}
