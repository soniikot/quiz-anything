import {
  Link,
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

import type { Quiz } from '@/api/quiz'
import QuizDisplay from '@/components/quiz/QuizDisplay'
import QuizResults from '@/components/quiz/QuizResults'

export const Route = createFileRoute('/take-quiz')({
  component: TakeQuiz,
})

function TakeQuiz() {
  const { isSignedIn, isLoaded, user } = useUser()
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '__root__' })
  const quizParam = (searchParams as any).quiz as string | undefined
  const sourceUrl = (searchParams as any).sourceUrl as string | undefined

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [userAnswers, setUserAnswers] = useState<Array<number | null>>([])
  const [showResults, setShowResults] = useState(false)

  const saveQuizAttempt = useMutation(api.quizzes.saveQuizAttempt)

  useEffect(() => {
    if (quizParam) {
      try {
        const parsedQuiz = JSON.parse(decodeURIComponent(quizParam))
        setQuiz(parsedQuiz)
        setUserAnswers(new Array(parsedQuiz.questions.length).fill(null))
      } catch (err) {
        console.error('Failed to parse quiz:', err)
        navigate({ to: '/dashboard' })
      }
    } else {
      navigate({ to: '/dashboard' })
    }
  }, [quizParam, navigate])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    setShowResults(true)

    // Save quiz results to Convex (only if signed in)
    if (isSignedIn) {
      const score = calculateScore()
      const wrongQuestions = quiz.questions
        .map((q, index) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswers[index] ?? -1,
          isWrong: userAnswers[index] !== q.correctAnswer,
        }))
        .filter((q) => q.isWrong)
        .map(({ question, options, correctAnswer, userAnswer }) => ({
          question,
          options,
          correctAnswer,
          userAnswer,
        }))

      try {
        await saveQuizAttempt({
          clerkId: user.id,
          quizTitle: quiz.title,
          sourceUrl: sourceUrl || '',
          totalQuestions: quiz.questions.length,
          correctAnswers: score,
          score: (score / quiz.questions.length) * 100,
          wrongQuestions: wrongQuestions,
        })
      } catch (err) {
        console.error('❌ Failed to save quiz attempt:', err)
        if (import.meta.env.DEV) {
          alert(
            'Failed to save quiz results. Please check if Convex is running.',
          )
        }
      }
    }
  }

  const calculateScore = () => {
    return quiz.questions.reduce(
      (correct: number, question: any, index: number) => {
        return correct + (userAnswers[index] === question.correctAnswer ? 1 : 0)
      },
      0,
    )
  }

  const handleTryAgain = () => {
    navigate({ to: '/dashboard' })
  }

  // If showing results, render that view
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/dashboard"
            className="mb-6 text-gray-400 hover:text-cyan-400 transition-colors inline-block"
          >
            ← Back to Dashboard
          </Link>
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            score={calculateScore()}
            onTryAgain={handleTryAgain}
          />
        </div>
      </div>
    )
  }

  // Showing quiz
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/dashboard"
          className="mb-6 text-gray-400 hover:text-cyan-400 transition-colors inline-block"
        >
          ← Back to Dashboard
        </Link>
        <QuizDisplay
          quiz={quiz}
          userAnswers={userAnswers}
          onAnswerSelect={handleAnswerSelect}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
