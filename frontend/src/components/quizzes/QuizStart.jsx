export default function QuizStart({ onStart }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-white/20">
            <div className="text-center">
              {/* Animated Icons */}
              <div className="flex justify-center space-x-4 mb-8">
                <div className="text-4xl animate-bounce">🏔️</div>
                <div className="text-4xl animate-bounce delay-75">🌲</div>
                <div className="text-4xl animate-bounce delay-150">📍</div>
                <div className="text-4xl animate-bounce delay-300">🏕️</div>
              </div>
  
              <h1 className="text-5xl font-bold text-white mb-4">
                Algerian Adventure Quiz
              </h1>
              
              <p className="text-xl text-white/90 mb-8">
                Test your knowledge of Algeria's stunning natural wonders!
              </p>
  
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-bold text-white">Compete for Ranks</h3>
                  <p className="text-white/80 text-sm">Earn badges and climb the leaderboard</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-bold text-white">Timed Challenges</h3>
                  <p className="text-white/80 text-sm">30 seconds per question</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-bold text-white">Smart Hints</h3>
                  <p className="text-white/80 text-sm">Get help when you're stuck</p>
                </div>
              </div>
  
              {/* Start Button */}
              <button
                onClick={onStart}
                className="group relative px-12 py-4 bg-white text-green-700 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">🚀 Start Adventure!</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
  
              {/* Instructions */}
              <div className="mt-12 text-white/80">
                <p className="mb-2">🏔️ 5 challenging questions about Algerian monuments</p>
                <p className="mb-2">⏱️ 30 seconds per question</p>
                <p className="mb-2">💡 Use hints (reduces points)</p>
                <p>🔥 Build streaks for bonus points!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }