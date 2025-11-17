import { Brain, Sparkles, Trophy, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="text-center mb-16 space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered Quiz Generation</span>
      </div>

      <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
        Turn Any{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Webpage
        </span>
        <br />
        Into a Quiz
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Paste any article, blog post, or documentation. Our AI instantly creates
        an interactive quiz to test your knowledge.
      </p>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
          <Zap className="w-10 h-10 text-cyan-400 mb-4 mx-auto" />
          <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
          <p className="text-gray-400 text-sm">Generate quizzes in seconds</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
          <Brain className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
          <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-400 text-sm">
            Smart questions from any content
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
          <Trophy className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
          <h3 className="text-white font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-400 text-sm">See your results instantly</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Try it free - No credit card required
      </div>
    </div>
  )
}
