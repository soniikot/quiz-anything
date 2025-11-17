import { CheckCircle2 } from 'lucide-react'
import type { Quiz } from '@/api/quiz'

type QuizDisplayProps = {
  quiz: Quiz
  userAnswers: Array<number | null>
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void
  onSubmit: () => void
}

export default function QuizDisplay({
  quiz,
  userAnswers,
  onAnswerSelect,
  onSubmit,
}: QuizDisplayProps) {
  const allAnswered = userAnswers.every((answer) => answer !== null)

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
        <p className="text-gray-400">
          Answer all {quiz.questions.length} questions below
        </p>
      </div>

      <div className="space-y-8">
        {quiz.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-slate-900/50 border border-slate-600 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              {qIndex + 1}. {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => onAnswerSelect(qIndex, oIndex)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswers[qIndex] === oIndex
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        userAnswers[qIndex] === oIndex
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-500'
                      }`}
                    >
                      {userAnswers[qIndex] === oIndex && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={!allAnswered}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-all shadow-lg shadow-cyan-500/50 disabled:shadow-none"
        >
          {allAnswered
            ? 'Submit Quiz'
            : `Answer all questions (${userAnswers.filter((a) => a !== null).length}/${quiz.questions.length})`}
        </button>
      </div>
    </div>
  )
}
