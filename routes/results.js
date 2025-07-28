var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const {score, totalQuestions, history} = req.query;
  const historyArray = JSON.parse(history);

  res.render('results', {
    score: score,
    totalQuestions: totalQuestions,
    history: historyArray
  });
});

module.exports = router;