'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'muna',
      fullname: 'muna',
      email: 'muna@muna.com',
      password: bcrypt.hashSync('munamuna', bcrypt.genSaltSync(8)),
      roleId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'muna2',
      fullname: 'muna2',
      email: 'muna2@muna.com',
      password: bcrypt.hashSync('muna2muna2', bcrypt.genSaltSync(8)),
      roleId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
