import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
// import server from '../../../server';
import fakeData from '../fakeData/fakeData';
process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
let adminToken, userToken, randomToken;

describe('Documents', () => {
  before((done) => {
    chai.request('http://localhost:5000')
      .post('/auth/api/users/login')
      .set('Accept', 'application/json')
      .send({ email: 'memuna.haruna@andela.com', password: 'memuna' })
      .end((error, response) => {
        expect(response.body.user.id).to.equal(1);
        expect(response.body.user.roleId).to.equal(1);
        expect(response.body.user.username).to.equal('memuna');
        expect(response.body.user.email).to.equal('memuna.haruna@andela.com');
        expect(response).to.have.status(200);
        // Save the token to use it later to access the application
        adminToken = response.body.token;
        done();
      });
  });

  it('fails, as expected', (done) => { // <= Pass in done callback
    chai.request('http://localhost:5000')
      .get('/')
      .end((error, response) => {
        expect(response.body).to.eql({});
        done(); // <= Call done to signal callback end
      });
  });

  it('succeeds silently!', (done) => { // <= No done callback
    chai.request('http://localhost:5000')
      .get('/')
      .end((error, response) => {
        expect(response).to.have.status(200); // <= Test completes before this runs
        done();
      });
  });

  it('should fail for an authenticated route', (done) => { // <= No done callback
    chai.request('http://localhost:5000')
      .get('/api/documents')
      .end((error, response) => {
        expect(response).to.have.status(403); // <= Test completes before this runs
        done();
      });
  });

  // it('should sign in a valid user', (done) => {
  //   chai.request('http://localhost:5000')
  //     .post('/auth/api/users/login')
  //     .set('Accept', 'application/json')
  //     .send({ email: 'memuna.haruna@andela.com', password: 'memuna' })
  //     .end((error, response) => {
  //       expect(response.body.user.id).to.equal(1);
  //       expect(response.body.user.roleId).to.equal(1);
  //       expect(response.body.user.username).to.equal('memuna');
  //       expect(response.body.user.email).to.equal('memuna.haruna@andela.com');
  //       expect(response).to.have.status(200);
  //       // Save the token to use it later to access the application
  //       adminToken = response.body.token;
  //       done();
  //     });
  // });

  it('should list ALL documents on /api/documents GET if token is valid for admin user', (done) => {
    chai.request('http://localhost:5000')
      .get('/api/documents')
      .set('authorization', adminToken)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });

  it('should add a single document to database on /api/documents POST if token is valid', (done) => {
    chai.request('http://localhost:5000')
      .post('/api/documents')
      .set('authorization', adminToken)
      .send({ userId: 1, title: 'Testing documents routes again', access: 1, content: 'yayyy we have one content again o' })
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response).to.be.json;
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('access');
        expect(response.body).to.have.property('content');
        done();
      });
  });
  console.log(fakeData.sampleDocument, 'fake sample document');
  it('should validate that a new sample document has a published date defined', (done) => {
    chai.request('http://localhost:5000')
      .post('/api/documents')
      .set('authorization', adminToken)
      .send('fakeData.sampleDocument')
      .end((error, response) => {
        expect(response).to.have.status(201);
        expect(response).to.be.json;
        expect(response.body).to.have.property('createdAt');
        if (error) return done(error);
        done();
      });
  });
});
