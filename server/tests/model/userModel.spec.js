import { expect } from 'chai';
import models from '../../models';
import mockData from '../mockData/mockData';

describe('User table', () => {
  after(() => {
    return models.User.sequelize.sync({ force: true });
  });

  it('should have expected fields on creating a user', (done) => {
    let roleData;
    models.Role.create(mockData.adminRole)
      .then((roleTempData) => {
        roleData = { ...roleTempData };
        mockData.firstUser.roleId = roleData.dataValues.id;
      })
      .then(() => {
        models.User.create(mockData.firstUser)
          .then((userData) => {
            expect(userData.dataValues.username).to.equal(mockData.firstUser.username);
            expect(userData.dataValues.fullname).to.equal(mockData.firstUser.fullname);
            expect(userData.dataValues.email).to.equal(mockData.firstUser.email);
            expect(userData.dataValues).to.have.property('roleId');
            expect(userData.dataValues).to.have.property('password');
            expect(userData.dataValues).to.have.property('createdAt');
          });
      });
    done();
  });
});
