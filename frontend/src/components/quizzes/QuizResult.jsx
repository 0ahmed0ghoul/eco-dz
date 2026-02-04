import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function QuizResult({ 
  score, 
  total = 5, 
  userAnswers = [], 
  onRestart,
  streak = 0,
  hintsUsed = 0,
  perfectScore = false // Add this prop - true if user got all answers correct
}) {
  const percentage = (score / (total * 2.5)) * 100;
  const [showDetails, setShowDetails] = useState(false);
  const [badges, setBadges] = useState([]);
  
  // Check local storage for user data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('quizUserData')) || {
      currentStreak: 0,
      maxStreak: 0,
      totalPerfectDays: 0,
      badges: [],
      lastPlayedDate: null
    };
    
    // Check if today is a new day
    const today = new Date().toDateString();
    const isNewDay = userData.lastPlayedDate !== today;
    
    if (perfectScore && isNewDay) {
      // Increment streak for perfect score on new day
      userData.currentStreak += 1;
      userData.totalPerfectDays += 1;
      userData.lastPlayedDate = today;
      
      // Update max streak
      if (userData.currentStreak > userData.maxStreak) {
        userData.maxStreak = userData.currentStreak;
      }
      
      // Award badges based on streak
      const newBadges = checkAndAwardBadges(userData.currentStreak, userData.badges);
      userData.badges = [...userData.badges, ...newBadges];
      
      // Save to localStorage
      localStorage.setItem('quizUserData', JSON.stringify(userData));
      setBadges(userData.badges);
      
      // Trigger confetti for badge achievement
      if (newBadges.length > 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    } else if (!isNewDay && perfectScore) {
      // Already played today, keep current streak
      setBadges(userData.badges);
    } else if (!perfectScore) {
      // Reset streak if not perfect
      userData.currentStreak = 0;
      userData.lastPlayedDate = today;
      localStorage.setItem('quizUserData', JSON.stringify(userData));
      setBadges(userData.badges);
    }
  }, [perfectScore]);

  // Function to check and award badges
  const checkAndAwardBadges = (currentStreak, existingBadges) => {
    const newBadges = [];
    const badgeIds = existingBadges.map(b => b.id);
    
    if (currentStreak >= 1 && !badgeIds.includes('first_perfect')) {
      newBadges.push({
        id: 'first_perfect',
        name: 'First Perfect',
        emoji: '🥇',
        description: 'First perfect score',
        color: 'from-yellow-300 to-yellow-500'
      });
    }
    
    if (currentStreak >= 3 && !badgeIds.includes('three_day_streak')) {
      newBadges.push({
        id: 'three_day_streak',
        name: 'Consistent Expert',
        emoji: '🔥',
        description: '3-day perfect streak',
        color: 'from-orange-400 to-red-500'
      });
    }
    
    if (currentStreak >= 7 && !badgeIds.includes('seven_day_streak')) {
      newBadges.push({
        id: 'seven_day_streak',
        name: 'Week Warrior',
        emoji: '🏆',
        description: '7-day perfect streak!',
        color: 'from-purple-500 to-pink-500'
      });
    }
    
    if (currentStreak >= 14 && !badgeIds.includes('two_week_master')) {
      newBadges.push({
        id: 'two_week_master',
        name: 'Master Explorer',
        emoji: '👑',
        description: '14-day perfect streak',
        color: 'from-blue-500 to-cyan-500'
      });
    }
    
    if (currentStreak >= 30 && !badgeIds.includes('month_perfect')) {
      newBadges.push({
        id: 'month_perfect',
        name: 'Legendary',
        emoji: '🌟',
        description: '30-day perfect streak!',
        color: 'from-green-400 to-emerald-600'
      });
    }
    
    return newBadges;
  };

  // Trigger confetti on component mount for high scores
  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  const getRank = () => {
    if (percentage >= 90) return { 
      title: 'Eco Explorer Master 🌟', 
      color: 'text-gradient bg-gradient-to-r from-yellow-600 to-red-600',
      emoji: '🏆',
      message: 'You\'re a true expert!'
    };
    if (percentage >= 70) return { 
      title: 'Nature Expert 🌿', 
      color: 'text-green-600',
      emoji: '🌳',
      message: 'Excellent knowledge!'
    };
    if (percentage >= 50) return { 
      title: 'Adventure Seeker 🥾', 
      color: 'text-blue-600',
      emoji: '🗺️',
      message: 'Great effort!'
    };
    return { 
      title: 'Journey Beginner 🚶‍♂️', 
      color: 'text-purple-600',
      emoji: '🌱',
      message: 'Keep exploring!'
    };
  };

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Result Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="text-center">
            
            {/* NEW: Badge Achievement Section */}
            {badges.length > 0 && badges[badges.length - 1]?.id.includes('seven_day_streak') && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-300 animate-pulse">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-xl font-bold text-purple-700">New Badge Unlocked!</h3>
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${badges[badges.length - 1].color} flex items-center justify-center text-3xl`}>
                    {badges[badges.length - 1].emoji}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg">{badges[badges.length - 1].name}</h4>
                    <p className="text-sm text-gray-600">{badges[badges.length - 1].description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trophy/Badge */}
            <div className="inline-block p-6 rounded-full bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 mb-6">
              <span className="text-6xl">{rank.emoji}</span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl font-bold ${rank.color} mb-2`}>
              {rank.title}
            </h1>
            <p className="text-gray-600 mb-6">{rank.message}</p>

            {/* NEW: Streak Display */}
            <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl inline-block">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                    <span>🔥</span>
                    <span>
                      {JSON.parse(localStorage.getItem('quizUserData'))?.currentStreak || 0}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="h-10 w-0.5 bg-orange-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {JSON.parse(localStorage.getItem('quizUserData'))?.maxStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Max Streak</div>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex justify-center items-baseline mb-8">
              <span className="text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {score.toFixed(1)}
              </span>
              <span className="text-2xl text-gray-500 ml-2">/ {(total * 2.5).toFixed(1)} pts</span>
            </div>

            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.827} 282.7`}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{percentage.toFixed(0)}%</span>
                <span className="text-sm text-gray-500">Accuracy</span>
              </div>
            </div>

            {/* Stats Grid - Updated */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{streak}</div>
                <div className="text-sm text-gray-600">🔥 Current Streak</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{total - hintsUsed}/{total}</div>
                <div className="text-sm text-gray-600">✨ Hint-Free</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {JSON.parse(localStorage.getItem('quizUserData'))?.badges?.length || 0}
                </div>
                <div className="text-sm text-gray-600">🏆 Badges</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{total}</div>
                <div className="text-sm text-gray-600">❓ Questions</div>
              </div>
            </div>

            {/* NEW: Badges Display */}
            {badges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Badges</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {badges.map((badge, index) => (
                    <div 
                      key={index}
                      className={`w-14 h-14 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center text-xl shadow-lg transform hover:scale-110 transition-transform`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      {badge.emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onRestart}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                {showDetails ? '📋 Hide Details' : '📋 Show Details'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        {showDetails && userAnswers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 animate-slideUp">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Your Answers</h2>
            <div className="space-y-4">
              {userAnswers.map((answer, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border-2 ${answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">Q{index + 1}: {answer.question}</span>
                    <span className={`font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {answer.points} pts
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Your answer:</span>
                      <div className={`font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {answer.userAnswer || 'Timeout'}
                      </div>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <span className="text-gray-500">Correct answer:</span>
                        <div className="font-medium text-green-700">
                          {answer.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW: Share Badges Section */}
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">Share your achievements!</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              📱 Share Badges
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              🏆 View All Badges
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}