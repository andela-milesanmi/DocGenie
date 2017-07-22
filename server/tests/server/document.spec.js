import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../models';
import mockData from '../mockData/mockData';
import server from '../../../server';

chai.use(chaiHttp);

const getUserToken = (data) => {
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

describe('Documents Controller', () => {
  let adminToken, userToken;
  before(() => {
    return models.Role.create(mockData.adminRole)
      .then((roleData) => {
        mockData.firstUser.roleId = roleData.dataValues.id;
        return models.Role.create(mockData.userRole);
      })
      .then(() => {
        return getUserToken(mockData.firstUser);
      })
      .then((token) => {
        adminToken = token;
        return getUserToken(mockData.secondUser);
      })
      .then((token) => {
        userToken = token;
        return models.Document.bulkCreate(mockData.bulkDocuments);
      })
      .catch((error) => {
        console.log(error, 'this is an error');
      });
  });
  after(() => {
    return models.Role.sequelize.sync({ force: true });
  });

  it('should allow a valid user sign in successfully', (done) => {
    const { email, password, username, roleId } = mockData.firstUser;
    chai.request(server)
      .post('/auth/api/users/login')
      .set('Accept', 'application/json')
      .send({ email, password })
      .end((error, response) => {
        expect(response.body.user.id).to.equal(1);
        expect(response.body.user.roleId).to.equal(roleId);
        expect(response.body.user.username).to.equal(username);
        expect(response.body.user.email).to.equal(email);
        expect(response).to.have.status(200);
        done();
      });
  });
  it('should not allow a user access an authenticated route', (done) => {
    chai.request(server)
      .get('/api/documents')
      .end((error, response) => {
        expect(response).to.have.status(401);
        done();
      });
  });
  it('should allow an admin user fetch ALL public and role-based documents', (done) => {
    chai.request(server)
      .get('/api/documents')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.an('object');
        expect(response.body.documents[0].id).to.equal(1);
        expect(response.body.documents[1].id).to.equal(2);
        expect(response.body.documents[2].id).to.equal(3);
        expect(response.body.documents[2].id).to.equal(3);
        expect(response.body.documents[1].username).to.equal(mockData.bulkDocuments[0].username);
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
  it('should allow an admin user add a public document to database', (done) => {
    const { title, content, access } = mockData.publicDocument;
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.publicDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.title).to.equal(title);
        expect(response.body.content).to.equal(content);
        expect(response.body.access).to.equal(access);
        done();
      });
  });
  it('should fail to create a new document if content is empty', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.invalidDocument)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('access');
        expect(response.body).to.not.have.property('content');
        done();
      });
  });
  it('should allow admin add a private document to database', (done) => {
    const { title, access } = mockData.privateDocument;
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.privateDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.title).to.equal(title);
        expect(response.body.access).to.equal(access);
        done();
      });
  });
  it('should validate that a new document created in database has a published date', (done) => {
    const { title, content } = mockData.sampleDocument;

    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.sampleDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('createdAt');
        expect(response.body.title).to.equal(title);
        expect(response.body.content).to.equal(content);
        done();
      });
  });
  it('should allow an admin add a role-access document to database', (done) => {
    const { title, access, content } = mockData.roleDocument;

    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.roleDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.title).to.equal(title);
        expect(response.body.content).to.equal(content);
        expect(response.body.access).to.equal(access);
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
    const { username, fullname, email } = mockData.publicDocument;

    chai.request(server)
      .get('/api/search/documents/?searchKey=public')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body.pagination).to.be.an('object');
        expect(response.body.documents[0]).to.have.property('user');
        expect(response.body.documents[0].username).to.eql(username);
        expect(response.body.documents[0].fullname).to.eql(fullname);
        expect(response.body.documents[0].email).to.eql(email);
        done();
      });
  });

  // ***** Regular user ****
  it('should allow a regular user list ALL documents', (done) => {
    chai.request(server)
      .get('/api/documents')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.an('object');
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        expect(response.body.documents[1].username).to.equal(mockData.bulkDocuments[0].username);
        done();
      });
  });
  it('should allow a regular user add a public document to database', (done) => {
    const { access, content } = mockData.userPublicDocument;

    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(mockData.userPublicDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.access).to.equal(access);
        expect(response.body.content).to.equal(content);
        done();
      });
  });
  it('should not allow a regular user create a new document if content is empty', (done) => {
    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(mockData.invalidDocument)
      .end((error, response) => {
        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.not.have.property('access');
        expect(response.body).to.not.have.property('content');
        done();
      });
  });
  it('should add a private document to database for a regular user if token is valid', (done) => {
    const { access, content } = mockData.userPrivateDocument;

    chai.request(server)
      .post('/api/documents')
      .set('authorization', userToken)
      .send(mockData.userPrivateDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.access).to.equal(access);
        expect(response.body.content).to.equal(content);
        done();
      });
  });
  it('should allow a regular user to update their own document successfully', (done) => {
    chai.request(server)
      .put('/api/documents/3')
      .set('authorization', userToken)
      .send({ content: 'public user document updated' })
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body.content).to.equal('public user document updated');
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
