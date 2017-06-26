import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
// var server = require('../server/app');

chai.use(chaiHttp);

describe('Documents', () => {
  it('fails, as expected', (done) => { // <= Pass in done callback
    chai.request('http://localhost:3030')
      .get('/')
      .end((error, response) => {
        expect(response).to.equal(undefined);
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
        expect(response).to.have.status(401); // <= Test completes before this runs
        done();
      });
  });

  it('should return expected values when a POST request is made', (done) => {
    chai.request('http://localhost:5000')
      .post('/api/documents')
      .end((error, response) => {
        expect(response).to.have.status(401); // <= Test completes before this runs
        done();
      });
  });
  it('should list ALL documents on /api/documents GET if token is valid', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJyb2xlSWQiOjIsImlhdCI6MTQ5ODQ0OTMzMywiZXhwIjoxNDk4NTM1NzMzfQ.s06oITOuofFKQgN_g3kyaXvw6z-V48_PdxP0zo0bJXI';

    chai.request('http://localhost:5000')
      .get('/api/documents')
      .set('x-access-token', token)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.an('object').that.has.all.keys('documents', 'pagination');
        done();
      });
  });
  it('should add a single document to database on /api/documents POST if token is valid', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxLCJyb2xlSWQiOjIsImlhdCI6MTQ5ODQ0OTMzMywiZXhwIjoxNDk4NTM1NzMzfQ.s06oITOuofFKQgN_g3kyaXvw6z-V48_PdxP0zo0bJXI';

    chai.request('http://localhost:5000')
      .post('/api/documents')
      .set('x-access-token', token)
      .send({ userId: 1, title: 'Testing documents routes again', access: 'public', content: 'yayyy we have one content again o' })
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
});
