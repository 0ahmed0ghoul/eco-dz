export default function QuizResult({ score }) {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Quiz Finished 🌍</h1>
      <p className="text-xl mt-4">Score: {score} / 5</p>

      {score >= 4 && <p className="text-green-600">Eco Explorer 🌱</p>}
      {score === 3 && <p className="text-yellow-600">Nature Lover 🌿</p>}
      {score < 3 && <p className="text-red-600">Keep Exploring 🚶‍♂️</p>}
    </div>
  );
}
