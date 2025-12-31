import { useEffect, useState } from "react";
import QuizQuestion from "../components/QuizQuestion";
import QuizResult from "../components/QuizResult";

// Mock quiz data for fallback
const FALLBACK_QUIZ_DATA = [
  { name: "Mount Chelia", category: "mountain", destination: "Khenchela – Algeria", physical_rating: 5 },
  { name: "Tassili n'Ajjer National Park", category: "desert", destination: "Illizi – Algeria", physical_rating: 4 },
  { name: "Hoggar Mountains (Ahaggar)", category: "desert", destination: "Tamanrasset – Algeria", physical_rating: 4 },
  { name: "Mount Tahat", category: "desert", destination: "Hoggar – Algeria", physical_rating: 5 },
  { name: "Chréa National Park", category: "park", destination: "Blida – Algeria", physical_rating: 2 },
  { name: "Beni Haroun Dam", category: "lake", destination: "Mila – Algeria", physical_rating: 1 },
  { name: "Zahlane Caves", category: "cave", destination: "Setif – Algeria", physical_rating: 2 },
  { name: "Lac Oubeira", category: "lake", destination: "El Tarf – Algeria", physical_rating: 1 },
  { name: "Sidi Fredj Coast", category: "beach", destination: "Algiers – Algeria", physical_rating: 1 },
  { name: "Atlas Cedar Forest in Mount Chelia", category: "forest", destination: "Khenchela – Algeria", physical_rating: 2 },
  { name: "Hammam Meskhoutine", category: "waterfall", destination: "Guelma – Algeria", physical_rating: 1 },
  { name: "Beni Salah Mountain", category: "mountain", destination: "Oum El Bouaghi – Algeria", physical_rating: 4 },
];

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch quizzes from API
  useEffect(() => {
    fetch("http://localhost:5000/api/places")
      .then(res => res.json())
      .then(data => {
        setMonuments(data);
        setQuestion(generateQuestion(data));
      });
  }, []);

  const selectRandomQuiz = (allQuizzes) => {
    if (allQuizzes.length === 0) return;
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    setCurrentQuiz(randomQuiz);
    generateQuestion(randomQuiz.questions);
  };

  const generateQuestion = (questions) => {
    if (questions.length === 0) return;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const options = shuffle([
      randomQuestion.correct_answer,
      ...randomQuestion.options.filter(opt => opt !== randomQuestion.correct_answer)
    ]);
    
    setQuestion({
      text: randomQuestion.question,
      correct: randomQuestion.correct_answer,
      options: options,
      explanation: randomQuestion.explanation
    });
  };

  const answer = (opt) => {
    if (opt === question.correct) setScore(s => s + 1);

    // Get the current quiz's question count
    const questionCount = currentQuiz?.questions?.length || 5;
    
    if (index >= questionCount - 1) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      generateQuestion(currentQuiz.questions);
    }
  };

  const handleRetake = () => {
    setQuestion(null);
    setScore(0);
    setIndex(0);
    setFinished(false);
    setCurrentQuiz(null);
    
    // Select a new random quiz
    if (quizzes.length > 0) {
      selectRandomQuiz(quizzes);
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-lg">Loading quizzes...</p>;
  }

  if (!question && !finished) {
    return <p className="text-center py-10 text-lg">Loading quiz...</p>;
  }

  if (finished) {
    const questionCount = currentQuiz?.questions?.length || 5;
    return <QuizResult score={score} total={questionCount} onRetake={handleRetake} />;
  }

  return (
    <QuizQuestion
      question={question.text}
      options={question.options}
      onAnswer={answer}
      current={index + 1}
      quizTitle={currentQuiz?.title}
      total={currentQuiz?.questions?.length || 5}
    />
  );
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
