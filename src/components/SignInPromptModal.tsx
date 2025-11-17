import { Sparkles, XCircle } from 'lucide-react'
import { SignInButton } from '@clerk/clerk-react'

type SignInPromptModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SignInPromptModal({
  isOpen,
  onClose,
}: SignInPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-cyan-500/20 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Love What You See?
          </h2>

          <p className="text-gray-300 mb-8 text-lg">
            Sign in to create unlimited quizzes, save your results, and track
            your learning progress!
          </p>

          <SignInButton mode="modal">
            <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg rounded-lg transition-all shadow-lg shadow-cyan-500/50 mb-4">
              Sign In Now
            </button>
          </SignInButton>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
