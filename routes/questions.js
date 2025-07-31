const { log } = require('console');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/db');
const DIFFICULTY = "hard";
const TYPE = "multiple";
const BASE_URL = "https://opentdb.com/api.php";

let cachedQuestions = [];
let questionNumber = 0;
let score = 0;
let history = [];

async function loadQuestions(amount, category) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        amount,
        category,
        difficulty: DIFFICULTY,
        type: TYPE
      }
    });

    const results = response.data.results;

    cachedQuestions = results.map(q => {
      const incorrect = q.incorrect_answers;
      const correct = q.correct_answer;

      const choices = [...incorrect, correct];

      return {
        question: q.question,
        A: choices[0],
        B: choices[1],
        C: choices[2],
        D: choices[3],
        answer: ["A", "B", "C", "D"][choices.indexOf(correct)]
      };
    });
  } catch(e) {
    throw(e);
  }
}

router.get('/', async function(req, res, next) {
  const { name = "Guest", email = "", loggedIn = "false", amount = 10, category = "" } = req.query;

  if (cachedQuestions.length === 0) {
    await loadQuestions(amount, category);
    questionNumber = 0;
    score = 0;
    history = [];
  }

  const question = cachedQuestions[questionNumber];

  res.render('questions', {
    name,
    email,
    loggedIn,
    questionNumber: questionNumber + 1,
    totalQuestions: cachedQuestions.length,
    questionPrompt: question.question,
    answer: question.answer,
    choiceA: question.A,
    choiceB: question.B,
    choiceC: question.C,
    choiceD: question.D,
    score
  });
});


router.post('/answer', function(req, res, next) {

  const { name = "Guest", email = "", loggedIn = "false", answer } = req.body;

  const selected = answer;
  const q = cachedQuestions[questionNumber];
  const correct = selected === q.answer;

  if (correct) {
    score++;
  }

  const prompt = q.question;
  const correctAnswer = matchAnswer(q, q.answer);
  const yourAnswer = matchAnswer(q, selected);

  history[questionNumber] = { prompt, answer: correctAnswer, yourAnswer };

  questionNumber++;

  if (questionNumber >= cachedQuestions.length) {
    const resultsURL = `/results?name=${name}&email=${email}&loggedIn=${loggedIn}&score=${score}&totalQuestions=${cachedQuestions.length}&history=${encodeURIComponent(JSON.stringify(history))}`;
    cachedQuestions = [];
    score = 0;
    history = [];
    questionNumber = 0;
    res.redirect(resultsURL);
  } else {
    res.redirect(`/questions?name=${name}&email=${email}&loggedIn=${loggedIn}&amount=${cachedQuestions.length}`);
  }
});

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



