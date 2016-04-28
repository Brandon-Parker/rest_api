const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  jwt.verify(req.headers.token, process.env.APP_SECRET, function(err, decoded) { //eslint-disable-line
    if (err) return res.status(403).json({ msg: 'invalid jwt' });
    User.findOne({ _id: decoded.idd }, function(err, data) { //eslint-disable-line
      if (err) return res.status(403).json({ msg: 'database done broked' });
      if (!data) return res.status(403).json({ msg: 'could not find user' });
      req.user = data;
      next();
    });
  });
};