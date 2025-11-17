import { Link } from "@tanstack/react-router"
import { Sparkles, LayoutDashboard, Brain } from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Sparkles className="w-10 h-10 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-black text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Anything Quiz
            </span>
          </h1>
        </Link>
        
        <SignedIn>
          <nav className="hidden md:flex items-center gap-4 ml-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/review-quiz"
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <Brain className="w-4 h-4" />
              <span>Review</span>
            </Link>
          </nav>
        </SignedIn>
      </div>

      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-white hover:text-cyan-400 font-medium transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  )
}
