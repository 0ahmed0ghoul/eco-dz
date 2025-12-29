import { useEffect, useState } from "react";
import QuizQuestion from "../components/QuizQuestion";
import QuizResult from "../components/QuizResult";

export default function Quiz() {
  const [monuments, setMonuments] = useState([]);
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/monuments")
      .then(res => res.json())
      .then(data => {
        setMonuments(data);
        setQuestion(generateQuestion(data));
      });
  }, []);

  const generateQuestion = (data) => {
    const m = data[Math.floor(Math.random() * data.length)];
    const type = ["category", "destination", "physical_rating"][
      Math.floor(Math.random() * 3)
    ];

    let text, correct, options;

    if (type === "category") {
      text = `What type of destination is "${m.name}"?`;
      correct = m.category;
      options = unique(data.map(x => x.category));
    }

    if (type === "destination") {
      text = `Where is "${m.name}" located?`;
      correct = m.destination;
      options = unique(data.map(x => x.destination));
    }

    if (type === "physical_rating") {
      text = `What is the physical difficulty of "${m.name}"?`;
      correct = m.physical_rating;
      options = [1, 2, 3, 4, 5];
    }

    return {
      text,
      correct,
      options: shuffle([correct, ...shuffle(options).slice(0, 3)])
    };
  };

  const answer = (opt) => {
    if (opt === question.correct) setScore(s => s + 1);

    if (index === 4) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setQuestion(generateQuestion(monuments));
    }
  };

  if (!question) return <p>Loading quiz...</p>;
  if (finished) return <QuizResult score={score} />;

  return (
    <QuizQuestion
      question={question.text}
      options={question.options}
      onAnswer={answer}
      current={index + 1}
    />
  );
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function unique(arr) {
  return [...new Set(arr)];
}
