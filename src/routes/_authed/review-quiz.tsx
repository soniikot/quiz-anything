import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Brain, Loader2 } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Quiz } from '@/api/quiz'
import QuizDisplay from '@/components/quiz/QuizDisplay'
import QuizResults from '@/components/quiz/QuizResults'

export const Route = createFileRoute('/_authed/review-quiz')({
  component: ReviewQuiz,
})

function ReviewQuiz() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [userAnswers, setUserAnswers] = useState<Array<number | null>>([])
  const [showResults, setShowResults] = useState(false)

  const unreviewedQuestions = useQuery(
    api.questions.getUnreviewedQuestions,
    isSignedIn ? { clerkId: user.id } : 'skip',
  )
  const markReviewed = useMutation(api.questions.markQuestionsAsReviewed)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Sign in to review questions
          </h2>
          <p className="text-gray-400">
            Review questions you previously got wrong
          </p>
        </div>
      </div>
    )
  }

  if (!unreviewedQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (unreviewedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Brain className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            All Caught Up! 🎉
          </h2>
          <p className="text-gray-400 mb-8">
            You don't have any questions to review. Great work!
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Convert unreviewed questions to Quiz format
  const quiz: Quiz = {
    title: 'Review Quiz - Your Missed Questions',
    questions: unreviewedQuestions.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })),
    generatedBy: 'ai',
  }

  // Initialize answers array if needed
  if (userAnswers.length === 0 && !showResults) {
    setUserAnswers(new Array(quiz.questions.length).fill(null))
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    setShowResults(true)

    // Mark these questions as reviewed
    if (unreviewedQuestions.length > 0) {
      try {
        await markReviewed({
          questionIds: unreviewedQuestions.map((q: any) => q._id),
        })
      } catch (err) {
        console.error('Failed to mark questions as reviewed:', err)
      }
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const resetQuiz = () => {
    setUserAnswers(new Array(quiz.questions.length).fill(null))
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Back to Dashboard Link */}
        <Link
          to="/dashboard"
          className="mb-6 text-gray-400 hover:text-cyan-400 transition-colors inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        {!showResults && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              <span>Review Mode</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Review Your{" "}
              <span className="text-purple-400">Missed Questions</span>
            </h1>
            <p className="text-xl text-gray-300">
              {unreviewedQuestions.length} questions waiting for you
            </p>
          </div>
        )}

        {/* Quiz */}
        {!showResults && (
          <QuizDisplay
            quiz={quiz}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmit}
          />
        )}

        {/* Results */}
        {showResults && (
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            score={calculateScore()}
            onTryAgain={resetQuiz}
          />
        )}
      </div>
    </div>
  )
}
