import { Trophy } from 'lucide-react'
import { SignInButton } from '@clerk/clerk-react'

export default function TrialLimitMessage() {
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-12 mb-8 text-center">
      <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">
        You've Tried Your Free Quiz!
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Sign in to unlock unlimited quiz generation, save your results, and
        track your progress
      </p>
      <SignInButton mode="modal">
        <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105">
          Sign In to Continue
        </button>
      </SignInButton>
    </div>
  )
}
