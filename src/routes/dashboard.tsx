import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Brain, Loader2 } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { generateQuizFromUrl } from '@/api/quiz'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import QuizGeneratorForm from '@/components/dashboard/QuizGeneratorForm'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ReviewCTA from '@/components/dashboard/ReviewCTA'
import RecentQuizzes from '@/components/dashboard/RecentQuizzes'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { isSignedIn, isLoaded, user } = useUser()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userSynced, setUserSynced] = useState(false)

  const getOrCreateUser = useMutation(api.users.getOrCreateUser)

  useEffect(() => {
    if (isSignedIn) {
      if (import.meta.env.DEV) {
        console.log('🔄 Syncing user to Convex...', { clerkId: user.id })
      }
      getOrCreateUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || undefined,
      })
        .then((userId) => {
          if (import.meta.env.DEV) {
            console.log('✅ User synced successfully:', userId)
          }
          setUserSynced(true)
        })
        .catch((err) => {
          console.error('❌ Failed to sync user:', err)
          if (import.meta.env.DEV) {
            alert(
              'Failed to connect to database. Please check if Convex is running.',
            )
          }
        })
    }
  }, [isSignedIn, user, getOrCreateUser])

  const stats = useQuery(
    api.users.getUserStats,
    isSignedIn && userSynced ? { clerkId: user.id } : 'skip',
  )
  const unreviewedQuestions = useQuery(
    api.questions.getUnreviewedQuestions,
    isSignedIn && userSynced ? { clerkId: user.id } : 'skip',
  )

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
            Sign in to view your dashboard
          </h2>
          <p className="text-gray-400">
            Track your progress and review wrong answers
          </p>
        </div>
      </div>
    )
  }

  if (!userSynced || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  const handleGenerateQuiz = async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const generatedQuiz = await generateQuizFromUrl({
        data: { url, numberOfQuestions },
      })

      navigate({
        to: '/take-quiz',
        search: {
          quiz: encodeURIComponent(JSON.stringify(generatedQuiz)),
          sourceUrl: url,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <DashboardHeader firstName={user.firstName || undefined} />

        <QuizGeneratorForm
          url={url}
          numberOfQuestions={numberOfQuestions}
          loading={loading}
          error={error}
          onUrlChange={setUrl}
          onNumberOfQuestionsChange={setNumberOfQuestions}
          onGenerate={handleGenerateQuiz}
        />

        <StatsGrid
          totalQuizzes={stats.stats.totalQuizzes}
          averageScore={stats.stats.averageScore}
          unreviewedQuestionsCount={stats.stats.unreviewedQuestionsCount}
        />

        {unreviewedQuestions && (
          <ReviewCTA unreviewedQuestionsCount={unreviewedQuestions.length} />
        )}

        <RecentQuizzes recentAttempts={stats.stats.recentAttempts} />
      </div>
    </div>
  )
}
