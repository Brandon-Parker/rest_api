const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const User = require(__dirname + '/../models/user');
const port = process.env.PORT = 4545;
process.env.MONGODB_URI = 'mongodb://localhost/jedi_sith_test_db';
const server = require(__dirname + '/../server');

describe('user authentication', () => {
  before((done) => {
    server.listen(port, () => {
      console.log('server up on port ' + port);
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close(() => {
        console.log('server has now closed');
        done();
      });
    });
  });
  it('should have user POST a new account in signup', (done) => {
    request('localhost:' + port)
    .post('/api/signup')
    .send({
      username: 'test',
      password: 'test'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.token.length).to.not.eql(0);
      done();
    });
  });
});

describe('the user sign is verified', () => {
  before((done) => {
    var newUser = new User({
      username: 'signIn',
      password: 'test'
    });
    newUser.generateHash(newUser.password);
    newUser.save((err, user) => {
      if (err) console.log(err);
      user.generateToken((err, token) => {
        if (err) console.log(err);
        this.token = token;
        this.user = user;
        done();
      });
    });
  });
  before((done) => {
    server.listen(port, () => {
      console.log('server up on port ' + port);
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close(() => {
        console.log('server has now closed');
        done();
      });
    });
  });
  it('should make a GET request', (done) => {
    request('localhost:' + port)
    .get('/api/signin')
    .auth('signIn', 'test')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.token.length).to.not.eql(0);
      done();
    });
  });
});
