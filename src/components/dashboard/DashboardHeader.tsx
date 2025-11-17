import { Link } from "@tanstack/react-router"
import { Sparkles } from "lucide-react"

type DashboardHeaderProps = {
  firstName?: string
}

export default function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl md:text-5xl font-black text-white">
          Your <span className="text-cyan-400">Dashboard</span>
        </h1>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Quiz</span>
        </Link>
      </div>
      <p className="text-xl text-gray-400">
        Welcome back, {firstName || "there"}! 👋
      </p>
    </div>
  )
}
