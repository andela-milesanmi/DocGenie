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
          return reject({ message: error });
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

  it('should allow an admin user fetch ALL public and role-based documents',
    (done) => {
      const { username } = mockData.bulkDocuments[0];
      chai.request(server)
        .get('/api/documents')
        .set('authorization', adminToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body.documents[0].id).to.equal(1);
          expect(response.body.documents[1].id).to.equal(2);
          expect(response.body.documents[2].id).to.equal(3);
          expect(response.body.documents[1].username).to.equal(username);
          expect(response.body).to.be.an('object').that.has
            .all.keys('documents', 'pagination');
          done();
        });
    });
  it('should allow an admin user add a public document to database',
    (done) => {
      const { title, content, access } = mockData.publicDocument;
      chai.request(server)
        .post('/api/documents')
        .set('authorization', adminToken)
        .send(mockData.publicDocument)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('access');
          expect(response.body).to.have.property('content');
          expect(response.body.userId).to.equal(1);
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
        expect(response.body).to.not.have.property('access');
        expect(response.body).to.not.have.property('content');
        done();
      });
  });
  it('should allow admin create a private document', (done) => {
    const { title, access, content } = mockData.privateDocument;
    chai.request(server)
      .post('/api/documents')
      .set('authorization', adminToken)
      .send(mockData.privateDocument)
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        expect(response.body.userId).to.equal(1);
        expect(response.body.title).to.equal(title);
        expect(response.body.access).to.equal(access);
        expect(response.body.content).to.equal(content);
        done();
      });
  });
  it('should validate that a created document has a published date', (done) => {
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
        expect(response.body.createdAt).to.not.be.null;
        done();
      });
  });
  it('should allow an admin create a role-access document',
    (done) => {
      const { title, access, content } = mockData.roleDocument;

      chai.request(server)
        .post('/api/documents')
        .set('authorization', adminToken)
        .send(mockData.roleDocument)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('access');
          expect(response.body).to.have.property('content');
          expect(response.body.userId).to.equal(1);
          expect(response.body.title).to.equal(title);
          expect(response.body.content).to.equal(content);
          expect(response.body.access).to.equal(access);
          done();
        });
    });
  it('should allow an admin user update their own document successfully',
    (done) => {
      chai.request(server)
        .put('/api/documents/8')
        .set('authorization', adminToken)
        .send({ title: 'sample doc', content: 'sample document updated' })
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('access');
          expect(response.body.title).to.equal('sample doc');
          expect(response.body.content).to.equal('sample document updated');
          done();
        });
    });
  it('should return an error if admin tries to fetch a non-existent document',
    (done) => {
      chai.request(server)
        .get('/api/documents/10')
        .set('authorization', adminToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.not.have.property('id');
          expect(response.body).to.not.have.property('userId');
          expect(response.body).to.eql({ message: 'Document Not Found' });
          done();
        });
    });
  it('should allow a user delete a document and see a message',
    (done) => {
      chai.request(server)
        .delete('/api/documents/2')
        .set('authorization', adminToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.eql({
            message: 'Document deleted successfully' });
          done();
        });
    });
  it('should allow a user search for particular documents',
    (done) => {
      const { username, fullname, email } = mockData.publicDocument;

      chai.request(server)
        .get('/api/search/documents/?searchKey=public')
        .set('authorization', adminToken)
        .end((error, response) => {
          expect(response).to.have.status(200);
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
    const { username } = mockData.bulkDocuments[0];
    chai.request(server)
      .get('/api/documents')
      .set('authorization', userToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object').that.has
          .all.keys('documents', 'pagination');
        expect(response.body.documents[1].username).to.equal(username);
        done();
      });
  });
  it('should allow a regular user create a public document',
    (done) => {
      const { access, content } = mockData.userPublicDocument;

      chai.request(server)
        .post('/api/documents')
        .set('authorization', userToken)
        .send(mockData.userPublicDocument)
        .end((error, response) => {
          expect(response).to.have.status(201);
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('access');
          expect(response.body).to.have.property('content');
          expect(response.body.access).to.equal(access);
          expect(response.body.content).to.equal(content);
          done();
        });
    });
  it('should not allow a user create a new document if content is empty',
    (done) => {
      chai.request(server)
        .post('/api/documents')
        .set('authorization', userToken)
        .send(mockData.invalidDocument)
        .end((error, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.not.have.property('access');
          expect(response.body).to.not.have.property('content');
          done();
        });
    });
  it('should allow a regular user create a private document',
    (done) => {
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
  it('should allow a regular user to update their own document successfully',
    (done) => {
      chai.request(server)
        .put('/api/documents/3')
        .set('authorization', userToken)
        .send({ content: 'public user doc updated' })
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('title');
          expect(response.body).to.have.property('access');
          expect(response.body.content).to.equal('public user doc updated');
          done();
        });
    });
  it('should return an error if a user tries to fetch a non-existent document',
    (done) => {
      chai.request(server)
        .get('/api/documents/16')
        .set('authorization', userToken)
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.not.have.property('id');
          expect(response.body).to.not.have.property('userId');
          expect(response.body).to.eql({ message: 'Document Not Found' });
          done();
        });
    });
  it('should validate that a user cannot update another user\'s document',
    (done) => {
      chai.request(server)
        .put('/api/documents/1')
        .set('authorization', adminToken)
        .send({ title: 'newest update', content: 'Lorem Ipsum' })
        .end((error, response) => {
          expect(response).to.have.status(403);
          expect(response.body).to.eql({ message:
             'You are not allowed to update this document'
          });
          done();
        });
    });
});
