import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Loader2 } from 'lucide-react'
import { generateQuizFromUrl } from '@/api/quiz'
import HeroSection from '@/components/HeroSection'
import UrlInput from '@/components/UrlInput'
import TrialLimitMessage from '@/components/TrialLimitMessage'
import SignInPromptModal from '@/components/SignInPromptModal'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUsedTrial, setHasUsedTrial] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  useEffect(() => {
    if (!isSignedIn) {
      const trialUsed = localStorage.getItem('trial_quiz_used')
      setHasUsedTrial(trialUsed === 'true')
    }
  }, [isSignedIn])

  const handleGenerateQuiz = async () => {
    if (!url) return

    if (!isSignedIn && hasUsedTrial) {
      setShowSignInPrompt(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const generatedQuiz = await generateQuizFromUrl({
        data: { url, numberOfQuestions: 5 },
      })

      if (!isSignedIn) {
        localStorage.setItem('trial_quiz_used', 'true')
        setHasUsedTrial(true)
      }

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <HeroSection />

        {/* Show trial limit message if not signed in and trial used */}
        {!isSignedIn && hasUsedTrial ? (
          <TrialLimitMessage />
        ) : (
          <>
            <UrlInput
              url={url}
              loading={loading}
              onUrlChange={setUrl}
              onGenerate={handleGenerateQuiz}
            />
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </>
        )}

        <SignInPromptModal
          isOpen={showSignInPrompt}
          onClose={() => setShowSignInPrompt(false)}
        />

        {isSignedIn && (
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">
              Ready to create your quiz? Enter a URL above or{' '}
              <button
                onClick={() => navigate({ to: '/dashboard' })}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
              >
                visit your dashboard
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
