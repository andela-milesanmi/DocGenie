import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../models';
import fakeData from '../fakeData/fakeData';


chai.use(chaiHttp);
const serverUrl = 'http://localhost:3333';

const promisify = (data) => {
  return new Promise((resolve, reject) => {
    chai.request(serverUrl)
      .post('/auth/api/users')
      .set('Content-Type', 'application/json')
      .send(data)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(response.body.token);
      });
  });
};

describe('Users', () => {
  let adminToken, userToken, testToken, adminRoleId, userRoleId;

  before(() => {
    return models.Role.create(fakeData.adminRole)
      .then((roleData) => {
        fakeData.firstUser.roleId = roleData.dataValues.id;
        return models.Role.create(fakeData.userRole);
      })
      .then(() => {
        return promisify(fakeData.firstUser);
      })
      .then((token) => {
        adminToken = token;
        return promisify(fakeData.secondUser);
      })
      .then((token) => {
        userToken = token;
        return models.Document.bulkCreate(fakeData.bulkDocuments);
      })
      .catch((error) => {
        console.log(error, 'this is an error');
      });
  });
  after(() => {
    return models.Role.sequelize.sync({ force: true });
  });

  it('should be able to sign in successfully if they are existing users', (done) => { // <= Pass in done callback
    const { email, password, username } = fakeData.firstUser;
    chai.request(serverUrl)
      .post('/auth/api/users/login')
      .set('Accept', 'application/json')
      .send({ email, password })
      .end((error, response) => {
        expect(response.body.user.id).to.equal(1);
        expect(response.body.user.roleId).to.equal(fakeData.firstUser.roleId);
        expect(response.body.user.username).to.equal(username);
        expect(response.body.user.email).to.equal(email);
        expect(response).to.have.status(200);
        done();
      });
  });
  it('should not be able to login if they do NOT already have accounts', (done) => { // <= Pass in done callback
    const { email, password } = fakeData.thirdUser;
    chai.request(serverUrl)
      .post('/auth/api/users/login')
      .set('Accept', 'application/json')
      .send({ email, password })
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body.message).to.equal('Not an existing user');
        done();
      });
  });
  it('should validate that a user cannot access an authenticated route without a token', (done) => { // <= No done callback
    chai.request(serverUrl)
      .get('/api/users')
      .end((error, response) => {
        expect(response).to.have.status(403); // <= Test completes before this runs
        done();
      });
  });

  it('should validate that a regular user can update their account details ', (done) => {
    chai.request(serverUrl)
      .put('/api/users/1')
      .set('authorization', userToken)
      .send({ fullname: 'Mikhail Stanislaski', email: 'mikhail.s@gmail.com' })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('roleId');
        expect(response.body).to.have.property('fullname');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('email');
        done();
      });
  });
  it('should be able to fetch all their own documents', (done) => {
    chai.request(serverUrl)
      .get('/api/users/2/documents')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.documents).to.be.an('array');
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
  it('should be able to search for a particular user', (done) => {
    chai.request(serverUrl)
      .get('/api/users/2/documents')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body.documents).to.be.an('array');
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
});
