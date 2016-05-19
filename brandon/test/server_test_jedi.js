const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const port = process.env.PORT = 4545;
process.env.MONGODB_URI = 'mongodb://localhost/jedi_sith_test_db';
const User = require(__dirname + '/../models/user');
require(__dirname + '/../server.js');
var Jedi = require(__dirname + '/../models/jedi');

describe('The POST requests', () => {
  before((done) => {
    var newUser = new User({
      username: 'testUser',
      password: 'testPW'
    });
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
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('should add a Jedi to the DB', (done) => {
    request('localhost:' + port)
    .post('/api/jedi')
    .set('token', this.token)
    .send({
      name: 'Brandon Parker',
      ranking: 'Jedi EMPEROR',
      weaponPreference: 'Two lightsabers',
      lightsaberColor: 'white',
      catchphrase: 'I win'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('Brandon Parker');
      expect(res.body.ranking).to.eql('Jedi EMPEROR');
      expect(res.body.weaponPreference).to.eql('Two lightsabers');
      expect(res.body.lightsaberColor).to.eql('white');
      expect(res.body.catchphrase).to.eql('I win');
      expect(res.body.handCount).to.eql('2');
      done();
    });
  });
});

describe('The Jedi GET request', () => {
  it('should bring all the Jedi together', (done) => {
    request('localhost:' + port)
    .get('/api/jedi')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(0);
      done();
    });
  });
});

describe('adding to the Jedi Council', () => {
  before((done) => {
    var newUser = new User({
      username: 'testUserPut',
      password: 'testPW'
    });
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
  beforeEach((done) => {
    var newJedi = new Jedi({
      name: 'Harry Potter',
      ranking: 'Force Wizard',
      weaponPreference: 'Stick thing',
      lightsaberColor: 'brown?',
      catchphrase: 'leviOsaaaa',
      handCount: '2'
    });
    newJedi.save((err, data) => {
        if (err) console.log(err);
      this.jedi = data;
      done();
    });
  });
  afterEach((done) => {
    this.jedi.remove((err) => {
      if (err) console.log(err);
    done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('PUT, you shall', (done) => {
    request('localhost:' + port)
    .put('/api/jedi/' + this.jedi._id)
    .set('token', this.token)
    .send({
      name: 'Gandalf',
      ranking: 'Higher Force Wizard',
      weaponPreference: 'EVEN BIGGER STICK',
      lightsaberColor: 'White..sometimes grey',
      catchphrase: 'You shall not pass!',
      handCount: '2'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('New Information, we have. Mmmm?');
      done();
    });
  });

  it('should banish the Jedi from the Council with a DELETE', (done) => {
    request('localhost:' + port)
    .delete('/api/jedi/' + this.jedi._id)
    .set('token', this.token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('I have felt a tremor in the force. The Dark Side calls');
      done();
    });
  });
});
