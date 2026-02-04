import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import {
  FaTrophy,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaFire,
  FaRocket,
  FaCrown,
  FaGem,
  FaMountain,
  FaHeart,
  FaShieldAlt,
  FaBolt,
  FaGlobeAmericas,
  FaLock,
  FaLockOpen,
  FaCoins,
  FaShoppingCart,
  FaRegCheckCircle,
  FaFireAlt,
  FaStarHalf,
  FaBrain,
  FaClock,
  FaChartLine,
  FaMedal
} from 'react-icons/fa';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

const AchievementTab = ({ userAchievements, points, onClaimReward }) => {
  const { userStats, allAchievementsData } = useContext(UserContext);
  const [achievements, setAchievements] = useState([]);
  const [userPoints, setUserPoints] = useState(points || 0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showClaimAll, setShowClaimAll] = useState(false);

  // Define all achievements with updated data from context
  const allAchievements = [
    {
      id: 'quiz_starter',
      title: 'Quiz Starter',
      description: 'Complete your first quiz',
      icon: FaRegCheckCircle,
      iconColor: 'text-emerald-500',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      points: 50,
      requirement: { type: 'quiz_completed', target: 1 },
      progressType: 'count',
      category: 'Knowledge'
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Answer quizzes correctly 10 days in a row',
      icon: FaBrain,
      iconColor: 'text-green-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      points: 350,
      requirement: { type: 'quiz_streak', target: 10 },
      progressType: 'streak',
      category: 'Knowledge'
    },
    {
      id: 'quiz_expert',
      title: 'Quiz Expert',
      description: 'Get perfect score in quiz 7 days streak',
      icon: FaFireAlt,
      iconColor: 'text-orange-500',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      points: 400,
      requirement: { type: 'perfect_quiz_streak', target: 7 },
      progressType: 'streak',
      category: 'Knowledge'
    },
    {
      id: 'quick_thinker',
      title: 'Quick Thinker ⚡',
      description: 'Answer 20 quiz questions in under 10 seconds each',
      icon: FaBolt,
      iconColor: 'text-yellow-500',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      points: 200,
      requirement: { type: 'quick_answers', target: 20 },
      progressType: 'count',
      category: 'Knowledge'
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz 5 times',
      icon: FaStarHalf,
      iconColor: 'text-purple-500',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      points: 300,
      requirement: { type: 'perfect_quizzes', target: 5 },
      progressType: 'count',
      category: 'Knowledge'
    },
    {
      id: 'nature_expert',
      title: 'Nature Expert',
      description: 'Score 100 points in total from quizzes',
      icon: FaMountain,
      iconColor: 'text-green-700',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      points: 500,
      requirement: { type: 'total_quiz_score', target: 100 },
      progressType: 'count',
      category: 'Knowledge'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: FaClock,
      iconColor: 'text-cyan-500',
      bgColor: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      points: 150,
      requirement: { type: 'fast_quiz', target: 1 },
      progressType: 'count',
      category: 'Knowledge'
    },
    {
      id: 'first_trip',
      title: 'First Adventure',
      description: 'Book your first trip on the platform',
      icon: FaRocket,
      iconColor: 'text-blue-500',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      points: 50,
      requirement: { type: 'trips_booked', target: 1 },
      progressType: 'count',
      category: 'Explorer'
    },
    {
      id: 'five_trips',
      title: 'Seasoned Explorer',
      description: 'Book 5 trips from the platform',
      icon: FaCalendarCheck,
      iconColor: 'text-green-500',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      points: 250,
      requirement: { type: 'trips_booked', target: 5 },
      progressType: 'count',
      category: 'Explorer'
    },
    {
      id: 'ten_trips',
      title: 'Travel Veteran',
      description: 'Book 10 trips from the platform',
      icon: FaGlobeAmericas,
      iconColor: 'text-purple-500',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      points: 500,
      requirement: { type: 'trips_booked', target: 10 },
      progressType: 'count',
      category: 'Explorer'
    },
    {
      id: 'five_star_traveler',
      title: '⭐ 5-Star Traveler',
      description: 'Get rated 5 stars by 20 different organizers',
      icon: FaStar,
      iconColor: 'text-yellow-500',
      bgColor: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      points: 300,
      requirement: { type: 'five_star_ratings', target: 20 },
      progressType: 'count',
      category: 'Reputation'
    },
    {
      id: 'place_explorer',
      title: 'Place Explorer',
      description: 'Visit 10 different places from the platform',
      icon: FaMapMarkerAlt,
      iconColor: 'text-red-500',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      points: 200,
      requirement: { type: 'places_visited', target: 10 },
      progressType: 'count',
      category: 'Explorer'
    },
    {
      id: 'reviewer',
      title: 'Active Reviewer',
      description: 'Write 15 reviews',
      icon: FaHeart,
      iconColor: 'text-pink-500',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      points: 150,
      requirement: { type: 'reviews_written', target: 15 },
      progressType: 'count',
      category: 'Community'
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Book 3 trips at least 30 days in advance',
      icon: FaBolt,
      iconColor: 'text-cyan-500',
      bgColor: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      points: 180,
      requirement: { type: 'early_bookings', target: 3 },
      progressType: 'count',
      category: 'Planner'
    },
    {
      id: 'mountain_conqueror',
      title: 'Mountain Conqueror',
      description: 'Complete 5 high-difficulty (4+ rating) trips',
      icon: FaMountain,
      iconColor: 'text-gray-700',
      bgColor: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-200',
      points: 300,
      requirement: { type: 'hard_trips', target: 5 },
      progressType: 'count',
      category: 'Adventure'
    },
    {
      id: 'loyal_member',
      title: 'Loyal Member',
      description: 'Active on platform for 1 year',
      icon: FaShieldAlt,
      iconColor: 'text-indigo-500',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      points: 500,
      requirement: { type: 'membership_days', target: 365 },
      progressType: 'days',
      category: 'Loyalty'
    },
    {
      id: 'knowledge_master',
      title: 'Knowledge Master',
      description: 'Unlock all Knowledge achievements',
      icon: FaCrown,
      iconColor: 'text-amber-500',
      bgColor: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      points: 1000,
      requirement: { type: 'all_knowledge', target: 1 },
      progressType: 'special',
      category: 'Master'
    }
  ];

  // Calculate user progress from stats
  useEffect(() => {
    const userProgress = {
      trips_booked: 0,
      five_star_ratings: 0,
      places_visited: 0,
      quiz_streak: userStats?.quiz_streak || 0,
      perfect_quiz_streak: userStats?.perfect_quiz_streak || 0,
      reviews_written: 0,
      early_bookings: 0,
      hard_trips: 0,
      membership_days: 0,
      quiz_completed: userStats?.quiz_attempts || 0,
      quick_answers: userStats?.quick_answers || 0,
      perfect_quizzes: userStats?.perfect_quizzes || 0,
      total_quiz_score: userStats?.total_quiz_score || 0
    };

    const unlocked = userAchievements || [];
    const knowledgeAchievements = allAchievements.filter(a => a.category === 'Knowledge');
    const hasAllKnowledge = knowledgeAchievements.every(a => unlocked.includes(a.id));

    // Calculate progress for each achievement
    const updatedAchievements = allAchievements.map(achievement => {
      const isUnlocked = unlocked.includes(achievement.id);
      let progress = 0;
      let current = 0;
      
      switch(achievement.requirement.type) {
        case 'trips_booked':
          current = userProgress.trips_booked || 0;
          break;
        case 'five_star_ratings':
          current = userProgress.five_star_ratings || 0;
          break;
        case 'places_visited':
          current = userProgress.places_visited || 0;
          break;
        case 'quiz_streak':
          current = userProgress.quiz_streak || 0;
          break;
        case 'perfect_quiz_streak':
          current = userProgress.perfect_quiz_streak || 0;
          break;
        case 'reviews_written':
          current = userProgress.reviews_written || 0;
          break;
        case 'early_bookings':
          current = userProgress.early_bookings || 0;
          break;
        case 'hard_trips':
          current = userProgress.hard_trips || 0;
          break;
        case 'membership_days':
          current = userProgress.membership_days || 0;
          break;
        case 'quiz_completed':
          current = userProgress.quiz_completed || 0;
          break;
        case 'quick_answers':
          current = userProgress.quick_answers || 0;
          break;
        case 'perfect_quizzes':
          current = userProgress.perfect_quizzes || 0;
          break;
        case 'total_quiz_score':
          current = userProgress.total_quiz_score || 0;
          break;
        case 'all_knowledge':
          current = hasAllKnowledge ? 1 : 0;
          break;
        default:
          current = 0;
      }

      progress = Math.min(Math.round((current / achievement.requirement.target) * 100), 100);
      
      return {
        ...achievement,
        unlocked: isUnlocked,
        progress,
        current,
        target: achievement.requirement.target,
        claimed: isUnlocked // In real app, track if points were claimed
      };
    });

    setAchievements(updatedAchievements);
    setUnlockedCount(updatedAchievements.filter(a => a.unlocked).length);
    
    // Check for unclaimed achievements
    const unclaimedCount = updatedAchievements.filter(a => a.unlocked && !a.claimed).length;
    setShowClaimAll(unclaimedCount > 0);
    
    // Calculate total points (should come from backend)
    const totalPoints = updatedAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + (a.claimed ? a.points : 0), 0);
    setUserPoints(totalPoints);
  }, [userAchievements, userStats]);

  const handleClaim = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.unlocked && !achievement.claimed) {
      onClaimReward(achievementId, achievement.points);
      
      // Update local state
      setAchievements(prev => prev.map(a => 
        a.id === achievementId ? { ...a, claimed: true } : a
      ));
      setUserPoints(prev => prev + achievement.points);
    }
  };

  const handleClaimAll = () => {
    const unclaimedAchievements = achievements.filter(a => a.unlocked && !a.claimed);
    const totalPoints = unclaimedAchievements.reduce((sum, a) => sum + a.points, 0);
    
    unclaimedAchievements.forEach(achievement => {
      onClaimReward(achievement.id, achievement.points);
    });
    
    // Update local state
    setAchievements(prev => prev.map(a => 
      a.unlocked && !a.claimed ? { ...a, claimed: true } : a
    ));
    setUserPoints(prev => prev + totalPoints);
    setShowClaimAll(false);
  };

  const categories = ['All', 'Knowledge', 'Explorer', 'Reputation', 'Community', 'Planner', 'Adventure', 'Loyalty', 'Master'];
  const filteredAchievements = activeCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const knowledgeProgress = achievements.filter(a => a.category === 'Knowledge');
  const knowledgeCompleted = knowledgeProgress.filter(a => a.unlocked).length;
  const knowledgeTotal = knowledgeProgress.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Achievements</h3>
            <p className="text-emerald-100 mt-1">Complete challenges and earn rewards</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-white to-white/80 p-3 rounded-lg">
                  <FaCoins className="text-amber-600 text-xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{userPoints}</div>
                  <div className="text-sm text-emerald-100">Points Earned</div>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-white to-white/80 p-3 rounded-lg">
                  <FaTrophy className="text-purple-600 text-xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{unlockedCount}/{allAchievements.length}</div>
                  <div className="text-sm text-emerald-100">Achievements</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Progress Bar */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaBrain className="text-emerald-300" />
              <span className="font-medium">Knowledge Mastery</span>
            </div>
            <span className="text-sm font-semibold">{knowledgeCompleted}/{knowledgeTotal}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(knowledgeCompleted / knowledgeTotal) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-emerald-200 mt-1">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Claim All Button */}
        {showClaimAll && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClaimAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Claim All Rewards
            </button>
          </div>
        )}
      </div>

      {/* Achievement Grid */}
      <div className="p-6">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-gray-400 text-2xl" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              No achievements in this category
            </h4>
            <p className="text-gray-500">Keep playing to unlock achievements!</p>
            <button 
              onClick={() => window.location.href = '/quiz'}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              Play Quiz to Earn Points
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredAchievements.map(achievement => {
                const Icon = achievement.icon;
                const isLocked = !achievement.unlocked;
                const isClaimed = achievement.claimed;
                
                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl border-2 p-5 transition-all duration-300 ${
                      isLocked
                        ? 'border-gray-200 bg-gray-50 opacity-80'
                        : `border-2 ${achievement.borderColor} bg-gradient-to-br ${achievement.bgColor} shadow-md hover:shadow-lg hover:-translate-y-1`
                    }`}
                  >
                    {/* New Achievement Badge */}
                    {achievement.unlocked && !achievement.claimed && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute inset-0 animate-ping bg-amber-500 rounded-full opacity-75"></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${
                        isLocked ? 'bg-gray-100' : 'bg-white shadow-sm'
                      }`}>
                        <Icon className={`text-2xl ${achievement.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {achievement.points}
                        </div>
                        <div className="text-xs text-gray-500">POINTS</div>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 text-lg mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {achievement.description}
                    </p>

                    {/* Progress Bar with animated fill */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.current}/{achievement.target}
                          {achievement.progressType === 'streak' && ' days'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isLocked 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isLocked 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {achievement.category}
                      </span>
                      
                      {isLocked ? (
                        <div className="text-gray-400 flex items-center gap-1 text-sm">
                          <FaLock className="w-3 h-3" />
                          {achievement.progress}%
                        </div>
                      ) : isClaimed ? (
                        <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                          <FaCheckCircle /> Claimed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaim(achievement.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all hover:shadow-md flex items-center gap-2 animate-pulse"
                        >
                          <FaCoins className="text-xs" />
                          Claim {achievement.points} pts
                        </button>
                      )}
                    </div>

                    {/* Streak Indicator for Knowledge achievements */}
                    {achievement.category === 'Knowledge' && achievement.progressType === 'streak' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FaFire className="text-orange-500" />
                          <span>Current Streak: {achievement.current} days</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Your Quiz Progress
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FaFire className="text-orange-500" />
                    <span className="font-medium text-gray-700">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats?.quiz_streak || 0} days</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FaStarHalf className="text-purple-500" />
                    <span className="font-medium text-gray-700">Perfect Scores</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats?.perfect_quizzes || 0}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="text-yellow-500" />
                    <span className="font-medium text-gray-700">Quick Answers</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats?.quick_answers || 0}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FaChartLine className="text-blue-500" />
                    <span className="font-medium text-gray-700">Total Score</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats?.total_quiz_score || 0}</div>
                </div>
              </div>
            </div>

            {/* Rewards Shop */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    🎁 Rewards Shop
                  </h4>
                  <p className="text-gray-600">
                    Use your points to unlock special features and discounts!
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{userPoints} points</div>
                  <div className="text-sm text-gray-500">Available to spend</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                      <FaShoppingCart className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Trip Discount</div>
                      <div className="text-sm text-gray-500">-10% on next booking</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">500 points</span>
                    <button 
                      disabled={userPoints < 500}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        userPoints >= 500
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= 500 ? 'Redeem' : 'Need more points'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                      <FaGem className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Premium Badge</div>
                      <div className="text-sm text-gray-500">Exclusive profile badge</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">1000 points</span>
                    <button 
                      disabled={userPoints < 1000}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        userPoints >= 1000
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= 1000 ? 'Get Premium' : 'Need more points'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                      <FaMedal className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Special Avatar</div>
                      <div className="text-sm text-gray-500">Unique profile avatar</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">750 points</span>
                    <button 
                      disabled={userPoints < 750}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        userPoints >= 750
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= 750 ? 'Unlock' : 'Need more points'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Want to earn more points?</p>
              <a 
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FaBrain />
                Play Daily Quiz
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementTab;