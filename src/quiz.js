const express = require("express");
const router = express.Router();
const { users } = require("./user"); // Import users from user.js

const quizzes = {};
let quizIdCounter = 1;
let questionIdCounter = 1;

// Create Quiz
router.post("/quizzes", (req, res) => {
  const { title, questions } = req.body;
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const quizId = quizIdCounter++;
  quizzes[quizId] = {
    id: quizId,
    title,
    questions: questions.map((q) => ({
      id: questionIdCounter++,
      text: q.text,
      options: q.options,
      correct_option: q.correct_option,
    })),
    results: {}, // User-specific results
  };

  res.status(201).json({ message: "Quiz created", quizId });
});

// Get Quiz
router.get("/quizzes/:quizId", (req, res) => {
  const { quizId } = req.params;
  const quiz = quizzes[quizId];

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json({
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
    })),
  });
});

// Submit Answer
router.post("/quizzes/:quizId/questions/:questionId/answer", (req, res) => {
  const { quizId, questionId } = req.params;
  const { selected_option, user_id } = req.body;

  if (!user_id || !users[user_id]) {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

  const quiz = quizzes[quizId];
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const question = quiz.questions.find((q) => q.id == questionId);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const isCorrect = question.correct_option === selected_option;

  // Track results per user
  if (!quiz.results[user_id]) {
    quiz.results[user_id] = { score: 0, answers: [] };
  }

  quiz.results[user_id].answers.push({
    question_id: questionId,
    selected_option,
    is_correct: isCorrect,
  });

  if (isCorrect) {
    quiz.results[user_id].score++;
  }

  res.json({
    is_correct: isCorrect,
    correct_option: isCorrect ? undefined : question.correct_option,
  });
});

// Get Results (User-Specific)
router.get("/quizzes/:quizId/users/:userId/results", (req, res) => {
  const { quizId, userId } = req.params;

  const quiz = quizzes[quizId];
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const userResults = quiz.results[userId];
  if (!userResults) {
    return res.status(404).json({ message: "Results not found for this user" });
  }

  res.json({
    quiz_id: quizId,
    user_id: userId,
    score: userResults.score,
    answers: userResults.answers,
  });
});

module.exports = router;
