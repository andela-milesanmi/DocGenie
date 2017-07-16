import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../models';
import fakeData from '../fakeData/fakeData';
import server from '../../../server';

chai.use(chaiHttp);

const promisify = (data) => {
  return new Promise((resolve, reject) => {
    chai.request(server)
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

describe('Documents', () => {
  let adminToken, userToken;
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

  it('should sign in a valid user successfully', (done) => { // <= Pass in done callback
    const { email, password, username } = fakeData.firstUser;
    chai.request(server)
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
  it('should fail for an authenticated route', (done) => { // <= No done callback
    chai.request(server)
      .get('/api/documents')
      .end((error, response) => {
        expect(response).to.have.status(403); // <= Test completes before this runs
        done();
      });
  });
  it('should list ALL documents for admin user if token is valid', (done) => {
    chai.request(server)
      .get('/api/documents')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
  it('should add a public document to database for admin if admin token is valid', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(fakeData.publicDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  it('should fail to create a new document if content is empty', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(fakeData.invalidDocument)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('access');
        expect(response.body).to.not.have.property('content');
        done();
      });
  });
  it('should add a private document to database for admin if admin token is valid', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(fakeData.privateDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  it('should validate that a new document created in database has a published date', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(fakeData.sampleDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('createdAt');
        done();
      });
  });
  it('should add a role-access document to database for admin if admin token is valid', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(fakeData.roleDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  it('should allow an admin user to update their own document successfully', (done) => {
    chai.request(server)
      .put('/api/documents/8')
      .set('authorization', adminToken)
      .send({ content: 'sample document updated' })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body.content).to.equal('sample document updated');
        done();
      });
  });
  it('should return an error if admin tries to retrieve a non-existing document', (done) => {
    chai.request(server)
      .get('/api/documents/10')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('id');
        expect(response.body).to.not.have.property('userId');
        expect(response.text).to.equal('Document Not Found');
        done();
      });
  });
  it('should delete a document and return a message', (done) => {
    chai.request(server)
      .delete('/api/documents/2')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.text).to.eql('Document deleted successfully');
        done();
      });
  });
  it('should retrieve documents on /api/search/documents GET if token is valid', (done) => {
    chai.request(server)
      .get('/api/search/documents/doc')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body.pagination).to.be.an('object');
        done();
      });
  });
  // ***** Regular user ****
  it('should list ALL documents for regular user if token is valid', (done) => {
    chai.request(server)
      .get('/api/documents')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
  it('should add a public document to database for regular user if token is valid', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(fakeData.userPublicDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  it('should fail to create a new document if content is empty', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(fakeData.invalidDocument)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('access');
        expect(response.body).to.not.have.property('content');
        done();
      });
  });
  it('should add a private document to database for a regular user if token is valid', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(fakeData.userPrivateDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  it('should allow a regular user to update their own document successfully', (done) => {
    chai.request(server)
      .put('/api/documents/3')
      .set('authorization', userToken)
      .send({ content: 'pulic user document updated' })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body.content).to.equal('pulic user document updated');
        done();
      });
  });
  it('should return an error if a regular tries to retrieve a non-existing document', (done) => {
    chai.request(server)
      .get('/api/documents/16')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(404);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('id');
        expect(response.body).to.not.have.property('userId');
        expect(response.text).to.equal('Document Not Found');
        done();
      });
  });
});
