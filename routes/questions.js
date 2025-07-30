const { log } = require('console');
const express = require('express');
const fs = require("fs");
const router = express.Router();
const { getCollection } = require('../models/db');

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
  const { name, email, loggedIn, amount } = req.query;

  if (selectedQuestions.length === 0) {
    totalQuestions = amount;
    selectQuestions(totalQuestions);
  }

  const question = selectedQuestions[questionNumber];

  const info = {
    name: name,
    email: email,
    amount: amount,
    loggedIn: loggedIn,
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


router.post('/answer', function(req, res, next) {

  const {name, email, loggedIn, answer} = req.body;

  const selected = answer;
  const q = selectedQuestions[questionNumber];
  const correct = selected === q.answer;

  if (correct) {
    score++;
  }

  const prompt = q.question;
  const correctAnswer = matchAnswer(q, q.answer);
  const yourAnswer = matchAnswer(q, selected);

  history[questionNumber] = {prompt, correctAnswer, yourAnswer};

  questionNumber++;

  if (questionNumber >= selectedQuestions.length) {
    res.redirect(`/results?name=${name}&email=${email}&loggedIn=${loggedIn}&score=${score}&totalQuestions=${totalQuestions}&history=${JSON.stringify(history)}`);
    questionNumber = 0;
    score = 0;
    selectedQuestions = [];
    history = []
  } else {
    res.redirect(`/questions?name=${name}&email=${email}&loggedIn=${loggedIn}&amount=${totalQuestions}`);
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



