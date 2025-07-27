var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  const {score, totalQuestions} = req.query;

  res.render('results', { 
    score: score,
    totalQuestions: totalQuestions
  });
});

module.exports = router;