const { log } = require('console');
const express = require('express');
const fs = require("fs");
const router = express.Router();

let totalQuestions = 10;
let cachedQuestions = [];
let selectedQuestions = [];
let questionNumber = 0;
let score = 0;
let history = [];

fs.readFile('questions.json', (error, data) => {
  if (error) throw error;
  cachedQuestions = JSON.parse(data);
});

router.get('/', function(req, res, next) {
  if (selectedQuestions.length === 0) {
    totalQuestions = req.query.amount;
    selectQuestions(totalQuestions);
  }

  const question = selectedQuestions[questionNumber];

  const info = {
    questionNumber: questionNumber + 1,
    totalQuestions: totalQuestions,
    questionPrompt: question.question,
    answer: question.answer,
    choiceA: question.A,
    choiceB: question.B,
    choiceC: question.C,
    choiceD: question.D,
    score: score
  }

  res.render('questions', info);
});

router.post('/answer', (req, res) => {
  const selected = req.body.answer;
  const q = selectedQuestions[questionNumber];
  const correct = selected === q.answer;

  if (correct) {
    score++;
  }

  const prompt = q.question;
  const answer = matchAnswer(q, q.answer);
  const yourAnswer = matchAnswer(q, selected);

  history[questionNumber] = {prompt, answer, yourAnswer};

  questionNumber++;

  if (questionNumber >= selectedQuestions.length) {
    res.redirect(`/results?score=${score}&totalQuestions=${totalQuestions}&history=${JSON.stringify(history)}`);
    questionNumber = 0;
    score = 0;
    selectedQuestions = [];
    history = []
  } else {
    res.redirect('/questions');
  }
});

function selectQuestions(amount) {
  let set = new Set();

  while (set.size < amount) {
    set.add(cachedQuestions[Math.floor(Math.random() * cachedQuestions.length)]);
  }

  selectedQuestions = Array.from(set);
}

function matchAnswer(question, string) {
  switch(string) {
    case "A": return question.A;
    case "B": return question.B;
    case "C": return question.C;
    case "D": return question.D;
    default: return null;
  }
}

module.exports = router;



