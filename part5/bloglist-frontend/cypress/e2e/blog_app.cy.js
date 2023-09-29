describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
    // Create a user
    const user = {
      name: 'Broken Stephie',
      username: 'stephie',
      password: 'imsad'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const user2 = {
      name: 'Tree Trunks',
      username: 'treetrunks',
      password: 'mrpig'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
  })

  it('Login form is shown', function() {
    cy.contains('username')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('stephie')
      cy.get('#password').type('imsad')
      cy.get('#submit-login').click()
      cy.contains('Broken Stephie logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('stephie')
      cy.get('#password').type('wrong')
      cy.get('#submit-login').click()
      cy.get('.notification').should('contain', 'Wrong credentials')
        .and('have.css', 'border-left-color', 'rgb(213, 26, 24)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user
      cy.login({ username: 'stephie', password: 'imsad' })
    })

    it('A new blog can be created', function() {
      cy.get('#create-new-blog').click()
      cy.get('#blog-title').type('Living for the moment')
      cy.get('#blog-author').type('Happy Jeffy')
      cy.get('#blog-url').type('https://fullstackopen.com/en/part5/end_to_end_testing')
      cy.get('#submit-blog').click()
      cy.contains('Living for the moment -- Happy Jeffy')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        const demoBlog = {
          title: 'Living for the moment',
          author: 'Happy Jeffy',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing',
        }
        cy.get('#create-new-blog').click()
        cy.get('#blog-title').type('Living for the moment')
        cy.get('#blog-author').type('Happy Jeffy')
        cy.get('#blog-url').type('https://fullstackopen.com/en/part5/end_to_end_testing')
        cy.get('#submit-blog').click()
        cy.contains('Living for the moment -- Happy Jeffy')
      })

      it('Can like a blog', function() {
        cy.contains('Living for the moment -- Happy Jeffy')
          .contains('show')
          .click()

        cy.contains('Living for the moment -- Happy Jeffy')
          .contains('like')
          .click()

        cy.contains('Living for the moment -- Happy Jeffy')
          .contains('Likes: 1')
      })

      it('Can delete a blog', function() {
        cy.contains('Living for the moment -- Happy Jeffy')
          .contains('show')
          .click()

        cy.contains('Living for the moment -- Happy Jeffy')
          .contains('Delete Blog')
          .click()

        cy.contains('Living for the moment -- Happy Jeffy')
          .should('not.exist')
      })

      it('Other users can\'t delete blog', function() {
        // Create a new blog
        cy.get('#create-new-blog').click()
        cy.get('#blog-title').type('This is a new blog')
        cy.get('#blog-author').type('Crybaby Stephie')
        cy.get('#blog-url').type('http://localhost:5173/')
        cy.get('#submit-blog').click()

        cy.wait(500)

        cy.contains('Logout').click()
        cy.get('#username').type('treetrunks')
        cy.get('#password').type('mrpig')
        cy.get('#submit-login').click()
        cy.contains('This is a new blog -- Crybaby Stephie')
          .contains('show')
          .click()
        cy.contains('This is a new blog -- Crybaby Stephie')
          .contains('Delete Blog')
          .should('not.exist')
      })
    })
  })
})