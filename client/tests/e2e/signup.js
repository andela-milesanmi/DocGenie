/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/

module.exports = {
  'User sign up without credentials': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#show-signup')
      .waitForElementVisible('#signup-form', 5000)
      .assert.containsText('#signup-text', 'Already have an account?Sign In')
      .setValue('input[name=username]', '')
      .setValue('input[name=fullname]', '')
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .setValue('input[name=confirmPassword]', '')
      .click('#signup-button')
      .pause(1000)
      .waitForElementVisible('h2', 5000)
      .assert.containsText('h2', 'Welcome to DocGenie');
  },
  'User sign up with wrong email': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#show-signup')
      .waitForElementVisible('#signup-form', 5000)
      .assert.containsText('#signup-text', 'Already have an account?Sign In')
      .setValue('input[name=username]', 'username')
      .setValue('input[name=fullname]', 'fullname')
      .setValue('input[name=email]', 'email')
      .setValue('input[name=password]', 'password')
      .setValue('input[name=confirmPassword]', 'password')
      .click('#signup-button')
      .pause(1000)
      .waitForElementVisible('h2', 5000)
      .assert.containsText('h2', 'Welcome to DocGenie');
  },
  'User sign up with non-matching password': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#show-signup')
      .waitForElementVisible('#signup-form', 5000)
      .assert.containsText('#signup-text', 'Already have an account?Sign In')
      .pause(1000)
      .setValue('input[name=username]', 'username')
      .setValue('input[name=fullname]', 'fullname')
      .setValue('input[name=email]', 'user@gmail.com')
      .setValue('input[name=password]', 'password')
      .setValue('input[name=confirmPassword]', 'confirmPassword')
      .click('#signup-button')
      .pause(1000)
      .waitForElementVisible('h2', 5000)
      .assert.containsText('h2', 'Welcome to DocGenie');
  },
  'User sign up successfully': (browser) => {
    browser
      .url('http://localhost:5000')
      .waitForElementVisible('body', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('#show-signup')
      .waitForElementVisible('#signup-form', 5000)
      .assert.containsText('#signup-text', 'Already have an account?Sign In')
      .pause(1000)
      .setValue('input[name=username]', 'username')
      .setValue('input[name=fullname]', 'fullname')
      .setValue('input[name=email]', 'user123@gmail.com')
      .setValue('input[name=password]', 'password')
      .setValue('input[name=confirmPassword]', 'password')
      .click('#signup-button')
      .waitForElementVisible('div[id="main-dash"]', 5000)
      .assert.containsText('h4', 'ALL DOCUMENTS')
      .assert.urlEquals(`${'http://localhost:5000/dashboard/documents/all'}`)
      .end();
  }
};
