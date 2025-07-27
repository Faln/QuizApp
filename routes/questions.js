const { log } = require('console');
const express = require('express');
const fs = require("fs");
const router = express.Router();

let totalQuestions = 10;
let cachedQuestions = [];
let selectedQuestions = [];
let questionNumber = 0;
let score = 0;

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
    questionNumber: questionNumber,
    totalQuestions: totalQuestions,
    questionPrompt: question.question,
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

  if (selected === selectedQuestions[questionNumber].answer) {
    score++;
  }

  questionNumber++;

  if (questionNumber >= selectedQuestions.length) {
    res.redirect(`/results?score=${score}&totalQuestions=${totalQuestions}`);
    questionNumber = 0;
    score = 0;
    selectedQuestions = [];
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

module.exports = router;



