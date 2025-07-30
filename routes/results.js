const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/db');

router.get('/', async (req, res) => {
  const { name, email, loggedIn, score, totalQuestions, history } = req.query;

  const numericScore = parseInt(score);
  const historyArray = JSON.parse(history || '[]');
  const isGuest = !loggedIn || loggedIn === 'false' || !email;

  const users = getCollection("quizUsers");

  let leaderboard = [];
  let userData = null;

  try {
    // If user is logged in, update score and fetch user data
    if (!isGuest) {
      await users.updateOne(
        { _id: email },
        {
          $inc: { overallScore: numericScore },
          $push: {
            playHistory: {
              score: numericScore,
              total: parseInt(totalQuestions),
              date: new Date(),
              history: historyArray
            }
          }
        }
      );

      userData = await users.findOne({ _id: email });
    }

    // Fetch top 10 players for leaderboard
    leaderboard = await users.find({})
      .sort({ overallScore: -1 })
      .limit(10)
      .project({ name: 1, overallScore: 1, _id: 0 })
      .toArray();

  } catch (e) {
    console.log("Error in /results:", e);
  }

  res.render('results', {
    score: numericScore,
    totalQuestions: totalQuestions,
    history: historyArray,
    isGuest,
    user: userData,
    leaderboard,
    name: name,
    email: email,
    loggedIn: loggedIn
  });
});

module.exports = router;