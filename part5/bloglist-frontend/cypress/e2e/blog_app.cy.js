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
    describe('Verify blog listings are sorted by likes', function () {
      it('Sorted by likes', function() {
        // Create 3 blogs
        cy.get('#create-new-blog').click()
        cy.get('#blog-title').type('This is blog #1')
        cy.get('#blog-author').type('Jane Doe')
        cy.get('#blog-url').type('http://localhost:5173/blog-1')
        cy.get('#submit-blog').click()
        cy.wait(500)

        cy.get('#create-new-blog').click()
        cy.get('#blog-title').type('This is blog #2')
        cy.get('#blog-author').type('Jane Doe')
        cy.get('#blog-url').type('http://localhost:5173/blog-2')
        cy.get('#submit-blog').click()
        cy.wait(500)

        cy.get('#create-new-blog').click()
        cy.get('#blog-title').type('This blog is the most popular')
        cy.get('#blog-author').type('Jane Doe')
        cy.get('#blog-url').type('http://localhost:5173/blog-3')
        cy.get('#submit-blog').click()
        cy.wait(500)

        // Get all the blogs
        cy.contains('This is blog #1').as('blog1')
        cy.contains('This is blog #2').as('blog2')
        cy.contains('This blog is the most popular').as('blog3')

        // Click the show more button for all
        cy.get('@blog1').contains('show').click()
        cy.get('@blog2').contains('show').click()
        cy.get('@blog3').contains('show').click()

        // Add likes
        cy.get('@blog1').contains('like').click()
        cy.wait(500)
        cy.get('@blog2').contains('like').click()
        cy.wait(500)
        cy.get('@blog2').contains('like').click()
        cy.wait(500)
        cy.get('@blog3').contains('like').click()
        cy.wait(500)
        cy.get('@blog3').contains('like').click()
        cy.wait(500)
        cy.get('@blog3').contains('like').click()
        cy.wait(500)

        // Verify order
        cy.get('.bloglisting').eq(0).should('contain', 'This blog is the most popular')
        cy.get('.bloglisting').eq(1).should('contain', 'This is blog #2')
        cy.get('.bloglisting').eq(2).should('contain', 'This is blog #1')
      })
    })
  })
})