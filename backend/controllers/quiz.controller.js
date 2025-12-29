import { getQuizzes, saveQuizzes, generateId } from "../data/fileHelpers.js";

// Get all quizzes
export const getAll = async (req, res) => {
  try {
    const quizzes = await getQuizzes();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};

// Get a specific quiz by ID
export const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const quizzes = await getQuizzes();
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

// Create a new quiz
export const create = async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    const quizzes = await getQuizzes();

    const newQuiz = {
      id: generateId(),
      title,
      description,
      questions,
      created_at: new Date().toISOString(),
      updated_at: null
    };

    quizzes.push(newQuiz);
    await saveQuizzes(quizzes);

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

// Update a quiz
export const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;

  try {
    const quizzes = await getQuizzes();
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.questions = questions || quiz.questions;
    quiz.updated_at = new Date().toISOString();

    await saveQuizzes(quizzes);

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
};

// Delete a quiz
export const deleteOne = async (req, res) => {
  const { id } = req.params;

  try {
    const quizzes = await getQuizzes();
    const quizIndex = quizzes.findIndex((q) => q.id === id);

    if (quizIndex === -1) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quizzes.splice(quizIndex, 1);
    await saveQuizzes(quizzes);

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};
