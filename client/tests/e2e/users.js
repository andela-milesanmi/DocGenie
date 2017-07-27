module.exports = {
  'Admin sign in and view users': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .setValue('input[name=email]', 'admin@gmail.com')
      .setValue('input[name=password]', 'adminadmin')
      .click('#signin-button')
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
      .waitForElementVisible('.nav-wrapper', 5000)
      .waitForElementVisible('.nav-logo', 5000)
      .click('.dropdown-button')
      .pause(2000)
      .click('#manage-users')
      .pause(3000)
      .waitForElementVisible('h4', 5000)
      .assert.urlEquals('http://localhost:5000/dashboard/users')
      .assert.containsText('h4', 'ALL USERS');
  },
  'Search users': (browser) => {
    browser
      .url('http://localhost:5000/dashboard/users')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .assert.containsText('h4', 'ALL USERS')
      .waitForElementVisible('div[id="search-users"]', 5000)
      .setValue('input[name=searchKey]', 'muna2')
      .pause(2000)
      .assert.containsText('#username', 'muna2')
      .pause(1000)
      .end();
  },
};
