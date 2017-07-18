/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/

module.exports = {
  'User sign in without credentials': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#signin-button')
      .waitForElementVisible('h2', 5000)
      .assert.containsText('h2', 'Welcome to DocGenie');
  },
  'User sign in with wrong email': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', 'non-existing')
      .setValue('input[name=password]', 'password123')
      .click('#signin-button')
      .waitForElementVisible('h2', 5000)
      .assert.containsText('h2', 'Welcome to DocGenie');
  },
  'User sign in with wrong password': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', 'admin@gmail.com')
      .setValue('input[name=password]', 'password123')
      .click('#signin-button')
      .waitForElementVisible('h2', 5000)
      .assert.elementPresent('h2', 'Welcome to DocGenie')
  },
  'User sign in success': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', 'muna2@muna2.com')
      .setValue('input[name=password]', 'muna2muna2')
      .click('#signin-button')
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard/documents/all'}`)
      .end();
  },
};
