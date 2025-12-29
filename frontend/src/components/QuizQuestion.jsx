export default function QuizQuestion({ question, options, onAnswer, current, quizTitle, total }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {quizTitle && (
          <p className="text-emerald-600 font-semibold mb-2 text-sm uppercase tracking-wide">
            {quizTitle}
          </p>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex-1">
              Question {current}
            </h2>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {current}/{total || 5}
            </span>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            {question}
          </p>
        </div>

        <div className="space-y-3">
          {options.map((o, i) => (
            <button
              key={i}
              onClick={() => onAnswer(o)}
              className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 font-medium text-gray-800 hover:text-emerald-700"
            >
              <span className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 mr-3 group-hover:border-emerald-500">
                  {String.fromCharCode(65 + i)}
                </span>
                {o}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Select an answer to continue
          </p>
        </div>
      </div>
    </div>
  );
}
