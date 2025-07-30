var express = require('express');
var router = express.Router();
const { getCollection } = require('../models/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const {name, email, loggedIn} = req.query;

  if (email === null || email === undefined) {
    res.render('index', { name: "Guest", email: null, loggedIn: loggedIn });
    return;
  }

  const collection = getCollection("quizUsers");

  try {
    const user = await collection.findOne({_id: email});

    res.render('index', {
      name: name,
      email: email,
      loggedIn: loggedIn,
    });
  } catch(e) {
    throw(e);
  }

  res.render('index', { name: "Guest", email: null, loggedIn: false });
});

router.get('/signin', function(req, res, next) {
  const {hasError, message} = req.query;

  if (hasError === null || hasError === undefined) {
    res.render('signin', {hasError: false, message: ""});
    return;
  }

  res.render('signin', {hasError: true, message: message});
});

router.post('/signin/submit', async function(req, res, next) {
  const { email, password } = req.body;

  if (email === null || email === undefined || password === null || password === undefined) {
    const message = `Invalid login credentials`;
    res.redirect(`../signin?hasError=true&message=${message}`);
    return;
  }

  const collection = getCollection("quizUsers");

  try {
    const user = await collection.findOne({_id: email});

    if (user.password !== password) {
      const message = `Wrong password`;
      res.redirect(`../signin?hasError=true&message=${message}`);
      return;
    }

    res.redirect(`../?name=${user.name}&email=${email}&loggedIn=true`);
  } catch(e) {
    const message = `Invalid login credentials 2`;
    res.redirect(`../signin?hasError=true&message=${message}`);
  }
});

router.get('/signup', function(req, res, next) {
  const {hasError, message} = req.query;

  if (hasError === null || hasError === undefined) {
    res.render('signup', {
      hasError: false, 
      message: ''
    });
    return;
  }

  res.render('signup', {
    hasError: hasError === 'true',
    message: message
  });
});

router.post("/signup/submit", async (req, res) => {
  const { name, email, password } = req.body;
  const collection = getCollection("quizUsers");

  try {
    await collection.insertOne({_id: email, name: name, email: email, password: password});
    res.redirect(`../questions?name=${name}&email=${email}&loggedIn=true`);
  } catch(e) {
    const message = `Email already exists or failed to sign up.`
    res.redirect(`../signup?hasError=true&message=${message}`);
  }
});

module.exports = router;
