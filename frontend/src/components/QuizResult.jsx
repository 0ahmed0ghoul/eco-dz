export default function QuizResult({ score, total = 5, onRetake }) {
  return (
    <div className="text-center p-10 min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Quiz Finished 🌍</h1>
        <p className="text-2xl font-semibold text-emerald-600 mb-6">Score: {score} / {total}</p>

        <div className="mb-8">
          {score >= 4 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-2">Eco Explorer 🌱</p>
              <p className="text-gray-600">Outstanding knowledge about sustainable travel!</p>
            </div>
          )}
          {score === 3 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 mb-2">Nature Lover 🌿</p>
              <p className="text-gray-600">Good understanding of eco-tourism practices!</p>
            </div>
          )}
          {score < 3 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 mb-2">Keep Exploring 🚶‍♂️</p>
              <p className="text-gray-600">Try again to improve your score!</p>
            </div>
          )}
        </div>

        <button
          onClick={onRetake}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors mb-3"
        >
          Retake Quiz
        </button>
        
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
