const Router = require('express').Router;
const Sith = require(__dirname + '/../models/sith');
const bodyParser = require('body-parser').json();
const errorHandler = require(__dirname + '/../lib/errorHandler');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
var sithRouter = module.exports = Router();

sithRouter.post('/sith', bodyParser, jwtAuth, (req, res) => {
  var newSith = new Sith(req.body);
  newSith.save((err, data) => {
    if (err) return errorHandler(err, res);
    res.status(200).json(data);
  });
});

sithRouter.get('/sith', (req, res) => {
  Sith.find(null, (err, data) => {
    if (err) return errorHandler(err, res);
    res.status(200).json(data);
  });
});

sithRouter.put('/sith/:id', bodyParser, jwtAuth, (req, res) => {
  var sithData = req.body;
  delete sithData._id;
  Sith.update({ _id: req.params.id }, sithData, (err) => {
    if (err) return errorHandler(err, res);
    res.status(200).json({ msg: 'New Information, we have. Mmmm?' });
  });
});

sithRouter.delete('/sith/:id', jwtAuth, (req, res) => {
  Sith.remove({ _id: req.params.id }, (err) => {
    if (err) errorHandler(req, res);
    res.status(200).json({ msg: 'I have felt a tremor in the force. The Dark Side calls' });
  });
});
