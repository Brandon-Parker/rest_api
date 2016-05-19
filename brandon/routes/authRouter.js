const express = require('express');
const User = require(__dirname + '/../models/user');
const jsonParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../lib/basic_http');

var router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;

  if (!password) return res.status(500).json({ msg: 'you probably don\'t want a blank password' });

  var newUser = new User(req.body);
  newUser.generateHash(password);
  password = null;

  newUser.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: 'could not create user' });
    }

    user.generateToken((err, token) => {
      if (err) return res.status(500).json({ msg: 'could not generate token, sign in later' });

      res.json({ token });
    });
  });
});

router.get('/signin', basicHTTP, (req, res) => {
  User.findOne({ username: req.auth.username }, (err, user) => {
    if (err) return res.status(500).json({ msg: 'authentication error. database error!' } );
    if (!user) return res.status(500).json({ msg: 'authentication error. user not found!' } );
    if (!user.compareHash(req.auth.password)) {
      return res.status(500).json({ msg: 'wrong password!' });
    }

    user.generateToken((err, token) => {
      if (err) return res.status(500).json({ msg: 'could not generate token, sign in later' });

      res.json({ token });
    });
  });
});
