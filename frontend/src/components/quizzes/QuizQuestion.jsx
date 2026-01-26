import { useState, useEffect } from 'react';
import { Mountain, MapPin, Activity, HelpCircle, Image, Folder, Clock, Award, Flame, Target, ChevronDown } from 'lucide-react';

export default function QuizQuestion({ 
  question, 
  options, 
  onAnswer, 
  current, 
  total,
  timer,
  score,
  streak,
  hint,
  monument,
  questionType
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setShowHint(false);
    setIsAnswered(false);
  }, [current]);

  const handleAnswer = (opt) => {
    if (isAnswered) return;
    
    setSelectedOption(opt);
    setIsAnswered(true);
    
    setTimeout(() => {
      onAnswer(opt, showHint);
    }, 1200);
  };

  const getOptionIcon = (index) => {
    const icons = [Mountain, MapPin, Activity, Target];
    const IconComponent = icons[index % icons.length];
    return IconComponent;
  };

  const getQuestionIcon = (type) => {
    const icons = {
      'category': Folder,
      'destination': MapPin,
      'physical_rating': Activity,
      'description_hint': HelpCircle,
      'image_guess': Image
    };
    return icons[type] || HelpCircle;
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

  const QuestionIcon = getQuestionIcon(questionType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border border-emerald-100">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0">
                {current}/{total}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg p-2">
                    <QuestionIcon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                    {questionType?.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                  {question}
                </h2>
                {monument?.description && (
                  <p className="text-gray-600 text-sm mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    💡 {monument.description.slice(0, 100)}...
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl px-5 py-3 text-center shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">Score</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {score.toFixed(1)}
                </div>
              </div>
              
              {streak > 0 && (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl px-5 py-3 text-center shadow-lg animate-pulse">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">Streak</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {streak}🔥
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Time Remaining</span>
              </div>
              <span className={`text-xl font-bold ${timer <= 10 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                {timer}s
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ease-linear ${
                  timer <= 10 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 
                  timer <= 20 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                  'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${(timer / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: total }).map((_, i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i < current - 1 
                    ? 'w-8 bg-emerald-500' 
                    : i === current - 1 
                    ? 'w-12 bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse' 
                    : 'w-2 bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = onAnswer && option === monument?.category || option === monument?.destination || option === monument?.name;
            const showResult = isAnswered && (isSelected || isCorrect);
            
            const OptionIcon = getOptionIcon(index);
            
            let cardClass = "bg-white hover:shadow-xl hover:scale-102 border-2 border-emerald-200";
            
            if (showResult) {
              if (isCorrect) {
                cardClass = "bg-gradient-to-br from-emerald-50 to-green-100 border-4 border-emerald-500 shadow-2xl scale-105";
              } else if (isSelected && !isCorrect) {
                cardClass = "bg-gradient-to-br from-red-50 to-pink-100 border-4 border-red-500 shadow-xl";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`${cardClass} rounded-2xl p-6 text-left transition-all duration-300 ${
                  !isAnswered ? 'cursor-pointer transform' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-md transition-all ${
                    showResult && isCorrect 
                      ? 'bg-emerald-500 scale-110' 
                      : showResult && !isCorrect 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-br from-teal-400 to-emerald-400'
                  }`}>
                    <OptionIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-800">
                      {questionType === 'physical_rating' ? (
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r ${getDifficultyColor(option)} shadow-md`}>
                            {option}
                          </span>
                          <span className="text-base font-semibold text-gray-600">
                            {getDifficultyLabel(option)}
                          </span>
                        </div>
                      ) : (
                        <span>{option}</span>
                      )}
                    </div>
                    {showResult && (
                      <div className={`text-sm font-bold mt-2 flex items-center gap-2 ${
                        isCorrect ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {isCorrect ? (
                          <>
                            <span className="text-xl">✓</span>
                            <span>Correct Answer!</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl">✗</span>
                            <span>Incorrect</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {showResult && isCorrect && (
                    <div className="text-4xl animate-bounce">🎯</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center justify-between w-full text-left p-6 hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Need a Hint?</h3>
                <p className="text-sm text-purple-600 font-medium">Click to reveal • Reduces points by 50%</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${showHint ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-6 h-6 text-purple-600" />
            </div>
          </button>
          
          {showHint && (
            <div className="px-6 pb-6 animate-slideDown">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-300 shadow-inner">
                <div className="flex items-center gap-2 text-purple-700 font-bold mb-3">
                  <span className="text-2xl">💡</span>
                  <span className="text-lg">Hint</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{hint}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Overall Progress</span>
            <span className="text-lg font-bold text-emerald-600">{Math.round((current / total) * 100)}%</span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-5 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((current - 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}