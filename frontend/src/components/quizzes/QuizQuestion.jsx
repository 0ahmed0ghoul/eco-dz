export default function QuizQuestion({ question, options, onAnswer, current }) {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Question {current}: {question}
      </h2>

      {options.map((o, i) => (
        <button
          key={i}
          onClick={() => onAnswer(o)}
          className="block w-full border p-2 mb-2 rounded hover:bg-green-100"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
