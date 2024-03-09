const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return a user object', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUser = testUsers.userRandomID;
    assert.deepEqual(user, expectedUser);
  });

  it('should return undefined if email non-existent.', function () {
    const user = getUserByEmail("use4@example.com", testUsers)
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../express_server');
chai.use(chaiHttp);

const expect = chai.expect;

describe('Server routes', function () {
  const agent = chai.request.agent('http://localhost:8080');

  it('GET / should redirect to /login', function () {
    return agent
      .get('/')
      .then(function (res) {
        expect(res).to.redirectTo('http://localhost:8080/login');
        //expect(res).to.have.status(302);
      });
  });

  it('GET /urls/new should redirect to /login', function () {
    return agent
      .get('/urls/new')
      .then(function (res) {
        expect(res).to.redirectTo('http://localhost:8080/login');
       // expect(res).to.have.status(302);
      });
  });

  it('GET /urls/NOTEXISTS should respond with status 404', function () {
    return agent
      .get('/urls/NOTEXISTS')
      .then(function (res) {
        expect(res).to.have.status(404);
      });
  });

  it('GET /urls/b6UTxQ should respond with status 403', function () {
    return agent
      .get('/urls/b6UTxQ')
      .then(function (res) {
        expect(res).to.have.status(403);
        agent.close();
      });
  });

});

