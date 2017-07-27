module.exports = {
  'Users should not be able to sign in with wrong email': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', 'non-existing')
      .setValue('input[name=password]', 'password123')
      .pause(1000)
      .click('#signin-button')
      .waitForElementVisible('.error-message', 5000)
      .assert.containsText('.error-message', 'Not an existing user')
      .pause(1000);
  },
  'Users should not be able to sign in with wrong password': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .pause(1000)
      .setValue('input[name=email]', 'admin@gmail.com')
      .setValue('input[name=password]', 'password123')
      .pause(1000)
      .click('#signin-button')
      .waitForElementVisible('.error-message', 5000)
      .assert.containsText('.error-message', 'Invalid password')
      .pause(1000);
  },
  'Users should be able to sign in successfully with correct details':
   (browser) => {
     browser
       .url('http://localhost:5000')
       .waitForElementVisible('body', 5000)
       .setValue('input[name=email]', 'muna2@muna2.com')
       .setValue('input[name=password]', 'muna2muna2')
       .pause(1000)
       .click('#signin-button')
       .waitForElementVisible('div[id="main-dash"]', 5000)
       .assert.containsText('h4', 'ALL DOCUMENTS')
       .assert.urlEquals(`${'http://localhost:5000/dashboard'}`)
       .pause(1000)
       .end();
   },
};
