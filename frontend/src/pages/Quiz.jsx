import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { 
  Leaf, Mountain, Compass, Award, Zap, Clock, HelpCircle, 
  ChevronRight, SkipForward, Target, Trophy, Flame,
  Sparkles, TrendingUp, Brain, Timer
} from "lucide-react";

export default function Quiz() {
  const { updateQuizAchievements, userStats, userAchievements, addPoints } = useContext(UserContext);
  
  const [monuments, setMonuments] = useState([]);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [quickAnswers, setQuickAnswers] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievementToast, setShowAchievementToast] = useState(false);

  const TOTAL_QUESTIONS = 5;

  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then(res => res.json())
      .then(data => {
        setMonuments(data);
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0 && question && !finished && isStarted) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && question && !finished) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [timer, question, finished, isStarted]);

  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const getUniqueOptions = (data, field, count, correct) => {
    const values = [...new Set(data.map(x => x[field]))].filter(v => v !== correct);
    return shuffle(values).slice(0, count - 1);
  };

  const getCategoryHint = (category) => {
    const hints = {
      'Mountain': 'This involves high altitude and hiking',
      'National Park': 'This is a protected natural area',
      'Coastal': 'This involves water bodies or beaches',
      'Cave': 'This is an underground formation',
      'Lake': 'This is a body of water'
    };
    return hints[category] || 'This is a tourist attraction';
  };
console.log(monuments);
  const generateQuestion = (data) => {
    if (!data || data.length === 0) return null;
    
    const availableMonuments = data.filter(m => 
      !questionHistory.some(q => q.monumentId === m.id)
    );
    const monumentsToUse = availableMonuments.length > 0 ? availableMonuments : data;
    
    const m = monumentsToUse[Math.floor(Math.random() * monumentsToUse.length)];
    
    setQuestionHistory(prev => {
      const newHistory = [...prev, { monumentId: m.id, timestamp: Date.now() }];
      return newHistory.slice(-10);
    });

    const types = [
      { type: "category", weight: 1 },
      { type: "destination", weight: 1 },
      { type: "physical_rating", weight: 1 },
      { type: "description_hint", weight: 0.7 },
      { type: "image_guess", weight: 0.5 }
    ];
    
    const weightedTypes = types.flatMap(type => 
      Array(Math.ceil(type.weight * 10)).fill(type.type)
    );
    const type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];

    let text, correct, options, hint, points;

    switch(type) {
      case "category":
        text = `What type of destination is "${m.name}"?`;
        correct = m.category || "Natural Site";
        options = getUniqueOptions(data, 'category', 4, correct);
        hint = `Hint: It's related to ${correct === 'Mountain' ? 'high altitude areas' : 
                correct === 'National Park' ? 'protected natural areas' : 
                correct === 'Coastal' ? 'water bodies' : 'tourist attractions'}`;
        points = 1;
        break;

      case "destination":
        text = `Where is "${m.name}" located?`;
        correct = m.destination || "Algeria";
        options = getUniqueOptions(data, 'destination', 4, correct);
        const destinationParts = correct.split('–');
        hint = `Hint: It's in ${destinationParts[1]?.trim() || 'Algeria'}`;
        points = 1;
        break;

      case "physical_rating":
        text = `What is the physical difficulty of visiting "${m.name}"?`;
        correct = m.physical_rating || 3;
        options = [1, 2, 3, 4, 5];
        hint = `Hint: Difficulty ranges from 1 (Easy) to 5 (Very Hard)`;
        points = 1.5;
        break;

      case "description_hint":
        text = `Based on this description: "${(m.description || '').slice(0, 100)}..." Which monument is this?`;
        correct = m.name;
        options = getUniqueOptions(data, 'name', 4, correct);
        hint = `Hint: ${getCategoryHint(m.category)}`;
        points = 2;
        break;

      case "image_guess":
        text = `Which monument would you associate with "${m.category}" in "${m.destination}"?`;
        correct = m.name;
        options = getUniqueOptions(data, 'name', 4, correct);
        hint = `Hint: ${(m.description || '').split('.')[0]}`;
        points = 2.5;
        break;

      default:
        text = `What type of destination is "${m.name}"?`;
        correct = m.category || "Natural Site";
        options = getUniqueOptions(data, 'category', 4, correct);
        hint = `Hint: It's a natural site`;
        points = 1;
    }

    const allOptions = shuffle([correct, ...options.filter(opt => opt !== undefined && opt !== null)]);
    
    return {
      id: Date.now(),
      text,
      correct,
      options: allOptions.slice(0, 4),
      hint,
      points,
      monument: m,
      type
    };
  };

  const answer = (opt, usedHint = false) => {
    if (!question || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(opt);
    
    // Check if answer was quick (under 10 seconds)
    const timeLeft = timer;
    const wasQuickAnswer = timeLeft > 20; // Answered in under 10 seconds
    if (wasQuickAnswer) {
      setQuickAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      const isCorrect = opt === question.correct;
      let pointsEarned = isCorrect ? question.points : 0;
      
      // Bonus for quick correct answers
      if (isCorrect && wasQuickAnswer) {
        pointsEarned *= 1.5;
      }
      let newStreak = streak;
      if (isCorrect) {
        newStreak = streak + 1;
        setStreak(newStreak);
      
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
      
        pointsEarned += streak * 0.5;
      } else {
        newStreak = 0;
        setStreak(0);
      }

      if (usedHint) {
        pointsEarned *= 0.5;
        setHintsUsed(h => h + 1);
      }

      if (isCorrect) {
        setScore(s => parseFloat((s + pointsEarned).toFixed(1)));
      }

      const newAnswer = {
        question: question.text,
        userAnswer: opt,
        correctAnswer: question.correct,
        isCorrect,
        points: pointsEarned.toFixed(1),
        questionType: question.type,
        timeSpent: 30 - timer,
        wasQuick: wasQuickAnswer,
        usedHint: usedHint
      };

      setUserAnswers(prev => [...prev, newAnswer]);

      setTimeout(() => {
        if (index + 1 === TOTAL_QUESTIONS) {
          const quizCompleteData = {
            score: parseFloat((score + (isCorrect ? pointsEarned : 0)).toFixed(1)),
            userAnswers: [...userAnswers, newAnswer],
            totalQuestions: TOTAL_QUESTIONS,
            correctAnswers: [...userAnswers, newAnswer].filter(a => a.isCorrect).length,
            maxStreak: newStreak > maxStreak ? newStreak : maxStreak,
            hintsUsed: usedHint ? hintsUsed + 1 : hintsUsed,
            quickAnswers: wasQuickAnswer ? quickAnswers + 1 : quickAnswers,
            perfectScore: [...userAnswers, newAnswer].every(a => a.isCorrect),
            date: new Date().toISOString()
          };
          
          // Update achievements
          const achievementsResult = updateQuizAchievements(quizCompleteData);
          if (achievementsResult.newAchievements.length > 0) {
            setNewAchievements(achievementsResult.newAchievements);
            setShowAchievementToast(true);
            setTimeout(() => setShowAchievementToast(false), 5000);
          }
          
          setFinished(true);
        } else {
          setIndex(i => i + 1);
          setTimer(30);
          setShowHint(false);
          setSelectedAnswer(null);
          setIsAnswering(false);
          const nextQuestion = generateQuestion(monuments);
          if (nextQuestion) {
            setQuestion(nextQuestion);
          }
        }
      }, 1500);
    }, 100);
  };

  const handleTimeout = () => {
    if (question) {
      answer(null, false);
    }
  };

  const startQuiz = () => {
    setIsStarted(true);
    const firstQuestion = generateQuestion(monuments);
    if (firstQuestion) {
      setQuestion(firstQuestion);
    }
    setTimer(30);
  };

  const resetQuiz = () => {
    setScore(0);
    setIndex(0);
    setFinished(false);
    setIsStarted(false);
    setUserAnswers([]);
    setStreak(0);
    setMaxStreak(0);
    setHintsUsed(0);
    setQuestionHistory([]);
    setTimer(30);
    setShowHint(false);
    setSelectedAnswer(null);
    setIsAnswering(false);
    setQuickAnswers(0);
    setNewAchievements([]);
    setShowAchievementToast(false);
  };

  const skipQuestion = () => {
    if (isAnswering) return;
    
    if (index + 1 === TOTAL_QUESTIONS) {
      const quizCompleteData = {
        score: score,
        userAnswers: userAnswers,
        totalQuestions: TOTAL_QUESTIONS,
        correctAnswers: userAnswers.filter(a => a.isCorrect).length,
        maxStreak: maxStreak,
        hintsUsed: hintsUsed,
        quickAnswers: quickAnswers,
        perfectScore: userAnswers.every(a => a.isCorrect),
        date: new Date().toISOString()
      };
      
      const achievementsResult = updateQuizAchievements(quizCompleteData);
      if (achievementsResult.newAchievements.length > 0) {
        setNewAchievements(achievementsResult.newAchievements);
        setShowAchievementToast(true);
      }
      
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setTimer(30);
      setShowHint(false);
      const nextQuestion = generateQuestion(monuments);
      if (nextQuestion) {
        setQuestion(nextQuestion);
      }
    }
  };

  const getQuestionIcon = (type) => {
    const IconMap = {
      'category': Mountain,
      'destination': Compass,
      'physical_rating': Target,
      'description_hint': Brain,
      'image_guess': Leaf
    };
    return IconMap[type] || HelpCircle;
  };

  const getDifficultyLabel = (rating) => {
    const labels = {
      1: 'Easy',
      2: 'Moderate',
      3: 'Challenging',
      4: 'Difficult',
      5: 'Expert'
    };
    return labels[rating] || 'Unknown';
  };

  const getDifficultyColor = (rating) => {
    const colors = {
      1: 'from-green-500 to-emerald-500',
      2: 'from-blue-500 to-cyan-500',
      3: 'from-yellow-500 to-amber-500',
      4: 'from-orange-500 to-red-500',
      5: 'from-red-600 to-rose-600'
    };
    return colors[rating] || 'from-gray-500 to-gray-600';
  };

  // Achievement Toast Component
  const AchievementToast = () => (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-5 max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">New Achievements Unlocked! 🎉</h4>
            <p className="text-sm opacity-90">You earned {newAchievements.length} new achievement(s)</p>
          </div>
        </div>
        <div className="space-y-2">
          {newAchievements.map((achievement, idx) => (
            <div key={idx} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{achievement.title}</span>
                <span className="font-bold text-yellow-300">+{achievement.points} pts</span>
              </div>
              <p className="text-xs opacity-80 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAchievementToast(false)}
          className="mt-3 w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-sm font-medium"
        >
          Awesome!
        </button>
      </div>
    </div>
  );

  // Loading Animation Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
            <Leaf className="absolute inset-0 m-auto w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Adventure</h2>
          <p className="text-gray-600">Preparing ecotourism destinations...</p>
        </div>
      </div>
    );
  }

  // Quiz Start Component
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <Compass className="w-16 h-16" />
              </div>
              <h1 className="text-4xl font-bold text-center mb-3">Ecotourism Knowledge Quest</h1>
              <p className="text-center text-emerald-100 text-lg">
                Test your knowledge about Algeria's natural wonders
              </p>
              
              {/* Achievement Progress */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats?.quiz_streak || 0}</div>
                    <div className="text-sm text-emerald-100">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {userAchievements?.filter(a => a.category === 'Knowledge')?.length || 0}
                    </div>
                    <div className="text-sm text-emerald-100">Knowledge Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats?.total_quiz_score || 0}</div>
                    <div className="text-sm text-emerald-100">Total Points</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center border border-emerald-200">
                  <Mountain className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-emerald-700">{TOTAL_QUESTIONS}</div>
                  <div className="text-sm text-emerald-600 font-medium">Questions</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-700">30s</div>
                  <div className="text-sm text-blue-600 font-medium">Per Question</div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center border border-amber-200">
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-700">Earn</div>
                  <div className="text-sm text-amber-600 font-medium">Points & Streaks</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  How to Play:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Answer questions about Algeria's natural destinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Quick answers earn bonus points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Build streaks for more bonus points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt=0.5" />
                    <span>Unlock achievements as you play</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Your Journey
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Result Component
  if (finished) {
    const percentage = (userAnswers.filter(a => a.isCorrect).length / TOTAL_QUESTIONS) * 100;
    const grade = percentage >= 80 ? 'Excellent Explorer!' : percentage >= 60 ? 'Great Adventurer!' : percentage >= 40 ? 'Nature Enthusiast!' : 'Keep Exploring!';
    const perfectScore = userAnswers.every(a => a.isCorrect);
    const quickAnswersCount = userAnswers.filter(a => a.wasQuick && a.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
        {showAchievementToast && <AchievementToast />}
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
              <Trophy className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Journey Complete!</h1>
              <p className="text-emerald-100 text-lg">{grade}</p>
              
              {perfectScore && (
                <div className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-xl inline-block animate-pulse">
                  <span className="font-bold">✨ Perfect Score! ✨</span>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center border border-emerald-200">
                  <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-emerald-700">{score.toFixed(1)}</div>
                  <div className="text-sm text-emerald-600 font-medium">Total Score</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-blue-700">
                    {userAnswers.filter(a => a.isCorrect).length}/{TOTAL_QUESTIONS}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Correct</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center border border-orange-200">
                  <Flame className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-orange-700">{maxStreak}</div>
                  <div className="text-sm text-orange-600 font-medium">Best Streak</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200">
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-purple-700">{quickAnswersCount}</div>
                  <div className="text-sm text-purple-600 font-medium">Quick Answers</div>
                </div>
              </div>

              {/* Achievement Progress */}
              <div className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                  Your Progress Towards Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Daily Streak</span>
                      <span className="text-sm font-bold text-amber-600">
                        {Math.min(userStats?.quiz_streak || 0, 10)}/10 days
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((userStats?.quiz_streak || 0) / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Perfect Score Streak</span>
                      <span className="text-sm font-bold text-amber-600">
                        {Math.min(userStats?.perfect_quiz_streak || 0, 7)}/7 days
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((userStats?.perfect_quiz_streak || 0) / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Review */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-emerald-600" />
                  Your Journey Review
                </h3>
                <div className="space-y-3">
                  {userAnswers.map((answer, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        answer.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 hover:shadow-md'
                          : 'bg-red-50 border-red-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              answer.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                            }`}>
                              {idx + 1}
                            </span>
                            <p className="font-semibold text-gray-800">{answer.question}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm ml-10">
                            <span className={`px-3 py-1.5 rounded-full font-medium ${
                              answer.isCorrect 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                                : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                              Your answer: {answer.userAnswer || 'No answer'}
                            </span>
                            {!answer.isCorrect && (
                              <span className="px-3 py-1.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border border-emerald-300">
                                Correct: {answer.correctAnswer}
                              </span>
                            )}
                            {answer.wasQuick && answer.isCorrect && (
                              <span className="px-3 py-1.5 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-300">
                                ⚡ Quick Answer
                              </span>
                            )}
                            {answer.usedHint && (
                              <span className="px-3 py-1.5 rounded-full font-medium bg-purple-100 text-purple-700 border border-purple-300">
                                💡 Hint Used
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            answer.isCorrect ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {answer.isCorrect ? '+' : ''}{answer.points}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">points</div>
                          <div className="text-xs text-gray-400 mt-1">
                            <Timer className="inline w-3 h-3 mr-1" />
                            {answer.timeSpent}s
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Play Again
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => window.location.href = '/achievements'}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  View Achievements
                  <Trophy className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Component
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-2xl text-gray-600 mb-4">Unable to load questions</div>
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const timerPercentage = (timer / 30) * 100;
  const timerColor = timer > 20 ? 'bg-emerald-500' : timer > 10 ? 'bg-amber-500' : 'bg-red-500';
  const QuestionIcon = getQuestionIcon(question.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      {showAchievementToast && <AchievementToast />}
      
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Progress Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl px-5 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-white" />
                  <span className="text-sm font-semibold text-white">Question</span>
                </div>
                <div className="text-3xl font-bold text-white text-center mt-1">{index + 1}/{TOTAL_QUESTIONS}</div>
              </div>
              
              {streak > 0 && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl px-5 py-3 shadow-lg animate-pulse">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">Streak</span>
                  </div>
                  <div className="text-3xl font-bold text-white text-center mt-1">{streak}🔥</div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl px-5 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-sm font-semibold text-white">Score</span>
                </div>
                <div className="text-3xl font-bold text-white text-center mt-1">{score.toFixed(1)}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl px-5 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-sm font-semibold text-white">Streak</span>
                </div>
                <div className="text-3xl font-bold text-white text-center mt-1">{userStats?.quiz_streak || 0} 🔥</div>
              </div>
            </div>
          </div>

          {/* Enhanced Timer Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Time Remaining</span>
                {timer > 20 && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    Quick Answer Bonus Available!
                  </span>
                )}
              </div>
              <span className={`text-lg font-bold ${timer <= 10 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                {timer}s
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute top-0 left-0 h-full ${timerColor} transition-all duration-1000 ease-linear shadow-sm`}
                style={{ width: `${timerPercentage}%` }}
              ></div>
              {/* Quick answer threshold marker */}
              {timer > 20 && (
                <div 
                  className="absolute top-0 w-1 h-full bg-yellow-500"
                  style={{ left: '66%' }}
                >
                  <div className="absolute -top-2 -left-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i < index 
                    ? 'w-8 bg-emerald-500' 
                    : i === index 
                    ? 'w-12 bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse' 
                    : 'w-2 bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 mb-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <QuestionIcon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-emerald-100 mb-1">
                  {question.type.replace('_', ' ').toUpperCase()}
                  {timer > 20 && (
                    <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                      ⚡ BONUS ACTIVE
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{question.text}</h2>
              </div>
            </div>
            
            {question.monument?.description && (
              <p className="text-emerald-100 text-sm bg-white/10 backdrop-blur-sm rounded-lg p-3">
                💡 {question.monument.description.slice(0, 100)}...
              </p>
            )}
          </div>

          <div className="p-8">
            {/* Enhanced Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.correct;
                const showResult = isAnswering && isSelected;
                
                const optionIcons = ['🏔️', '🌲', '🏖️', '🗺️'];
                
                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswering && answer(option, showHint)}
                    disabled={isAnswering}
                    className={`group relative p-6 rounded-2xl text-left font-medium transition-all duration-300 border-2 ${
                      showResult
                        ? isCorrect
                          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500 shadow-lg scale-105'
                          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-500 shadow-lg'
                        : isAnswering
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 hover:scale-102 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        showResult && isCorrect 
                          ? 'bg-emerald-200' 
                          : showResult && !isCorrect 
                          ? 'bg-red-200' 
                          : 'bg-gradient-to-br from-teal-100 to-emerald-100 group-hover:scale-110'
                      }`}>
                        {optionIcons[idx % optionIcons.length]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-800">
                          {question.type === 'physical_rating' ? (
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-lg text-white bg-gradient-to-r ${getDifficultyColor(option)}`}>
                                {option}
                              </span>
                              <span className="text-sm font-normal text-gray-600">
                                {getDifficultyLabel(option)}
                              </span>
                            </div>
                          ) : (
                            option
                          )}
                        </div>
                        {showResult && (
                          <div className={`text-sm font-semibold mt-1 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}
                            {isCorrect && timer > 20 && (
                              <span className="ml-2 text-yellow-600">
                                ⚡ +50% Quick Answer Bonus!
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {showResult && isCorrect && (
                        <div className="text-3xl animate-bounce">🎯</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Enhanced Hint Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 overflow-hidden mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                disabled={isAnswering}
                className="flex items-center justify-between w-full text-left p-5 hover:bg-purple-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Need a Hint?</h3>
                    <p className="text-sm text-purple-600">Click to reveal • Reduces points by 50%</p>
                  </div>
                </div>
                <div className={`transform transition-transform text-purple-600 ${showHint ? 'rotate-180' : ''}`}>
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </div>
              </button>
              
              {showHint && (
                <div className="px-5 pb-5 animate-fadeIn">
                  <div className="bg-white rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                      <span className="text-lg">💡</span>
                      <span>Hint:</span>
                    </div>
                    <p className="text-gray-700">{question.hint}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={skipQuestion}
                disabled={isAnswering}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
                  isAnswering 
                    ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg'
                }`}
              >
                <SkipForward className="w-5 h-5" />
                Skip This Question
              </button>
              
              {!showHint && timer > 20 && (
                <div className="flex-1 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-xl p-3 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">
                    Answer quickly for +50% bonus!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}