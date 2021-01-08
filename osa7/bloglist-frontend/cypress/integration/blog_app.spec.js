describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Super user',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Super user logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('joku muu')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'root', password: 'salainen'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#create-blog-button').click()

      cy.contains('test title test author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: { title: 'test title', author: 'test author', url: 'test url' },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })

        cy.visit('http://localhost:3000')
      })

      it('it can be liked', function () {
        cy.contains('test title test author')
          .contains('view')
          .click()

        cy.contains('likes 0')
          .contains('like')
          .click()

        cy.contains('likes 1')
      })

      it('it can be deleted by the owner', function () {
        cy.contains('test title test author')
          .contains('view')
          .click()

        cy.contains('remove')
          .click()

        cy.contains('blog deletion succeeded')
      })
    })

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: { title: 'test title', author: 'test author', url: 'test url', likes: 1 },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: { title: 'test title2', author: 'test author2', url: 'test url2', likes: 2 },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3001/api/blogs',
          method: 'POST',
          body: { title: 'test title3', author: 'test author3', url: 'test url3', likes: 3 },
          headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })

        cy.visit('http://localhost:3000')
      })

      it('blogs are ordered by number of likes', function () {
        cy.get('.blog').then(blogs => {
          for (var i = 0; i < blogs.length; i++) {
            cy.wrap(blogs[i]).contains('view').click()
          }
        })

        cy.get('.blog > div:last-child > div:nth-child(2)').should(blogs => {
          let likesInOrder = []
          for (var i = 0; i < blogs.length; i++) {
            likesInOrder = likesInOrder.concat(Number(blogs[i].innerText.substring(6, 7)))
          }
          console.log(likesInOrder)
          expect(likesInOrder).to.have.ordered.members([3, 2, 1])
        })
      })
    })
  })
})