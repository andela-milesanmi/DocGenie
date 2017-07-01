'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Documents', [{
      title: 'The Awakening',
      content: `Hello, My name is Abiodun and I need to take time off
      work, " The dark nerdy-looking young man
      beside me said and the entire room chuckled.`,
      userId: 1,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'The Awakeninggg',
      content: `Esther was excited, super excited to be travelling to
      see her paternal grandmother in Ijebu-Ode for the Sallah break.`,
      userId: 2,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
