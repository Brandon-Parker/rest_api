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
const Sith = require(__dirname + '/../models/sith');

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
  it('should add a Sith to the DB', (done) => {
    request('localhost:' + port)
    .post('/api/jedi')
    .set('token', this.token)
    .send({
      name: 'Darth Bandon',
      ranking: 'Sith Lord',
      weaponPreference: 'Double Bladed',
      lightsaberColor: 'gold',
      catchphrase: 'Bow before me'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.name).to.eql('Darth Bandon');
      expect(res.body.ranking).to.eql('Sith Lord');
      expect(res.body.weaponPreference).to.eql('Double Bladed');
      expect(res.body.lightsaberColor).to.eql('gold');
      expect(res.body.catchphrase).to.eql('Bow before me');
      expect(res.body.handCount).to.eql('2');
      done();
    });
  });
});

describe('The Sith GET request', () => {
  it('should bring all the Sith together', (done) => {
    request('localhost:' + port)
    .get('/api/sith')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(0);
      done();
    });
  });
});

describe('adding to the Sith Council', () => {
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
    var newSith = new Sith({
      name: 'Spock',
      ranking: 'Space Wizard',
      weaponPreference: 'The Enterprise',
      lightsaberColor: 'mind control',
      catchphrase: 'Live long and prosper',
      handCount: '2'
    });
    newSith.save((err, data) => {
      if (err) console.log(err);
      this.sith = data;
      done();
    });
  });
  afterEach((done) => {
    this.sith.remove((err) => {
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
    .put('/api/sith/' + this.sith._id)
    .set('token', this.token)
    .send({
      name: 'Sauromon',
      ranking: 'Evil Mythic Wizard',
      weaponPreference: 'Minions',
      lightsaberColor: 'A spooky orb',
      catchphrase: 'I do not have real power',
      handCount: '2'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('New Information, we have. Mmmm?');
      done();
    });
  });

  it('should banish the Sith from the Council with a DELETE', (done) => {
    request('localhost:' + port)
    .delete('/api/sith/' + this.sith._id)
    .set('token', this.token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.body.msg).to.eql('I have felt a tremor in the force. The Dark Side calls');
      done();
    });
  });
});
