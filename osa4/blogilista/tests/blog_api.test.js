const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogs = [
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 },
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
    { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

describe('when there are initally some blogs saved', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        await Blog.deleteMany({})
        await Blog.insertMany(blogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(blogs.length)
    })

    test('blogs have correct id field', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
        })
    })

    test('a valid blog can be added', async () => {
        const user = {
            username: 'root',
            password: 'salainen'
        }

        const result = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: "A title",
            author: "You",
            url: "localhost",
            likes: 4
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd.length).toBe(blogs.length + 1)

        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain("A title")
    })

    test('a blogs likes field defaults to 0', async () => {
        const user = {
            username: 'root',
            password: 'salainen'
        }

        const result = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: "Another title",
            author: "Me",
            url: "localhost"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const addedBlog = await Blog.find({ title: "Another title" })
        expect(addedBlog[0].likes).toBe(0)
    })

    test('an added blog has to contain the fields title and url', async () => {
        const user = {
            username: 'root',
            password: 'salainen'
        }

        const result = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlogWithoutTitle = {
            author: "Me",
            url: "localhost"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlogWithoutTitle)
            .expect(400)

        const newBlogWithoutUrl = {
            title: "Another title",
            author: "Me"
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlogWithoutUrl)
            .expect(400)
    })

    test('a blog should be able to be removed', async () => {
        const user = {
            username: 'root',
            password: 'salainen'
        }

        const result = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: "To be removed",
            author: "You",
            url: "localhost",
            likes: 6
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const addedBlog = await Blog.find({ title: "To be removed" })

        await api
            .delete(`/api/blogs/${addedBlog[0].id}`)
            .set('Authorization', `bearer ${result.body.token}`)
            .expect(204)
    })

    test('a blog should be able to be changed', async () => {
        const user = {
            username: 'root',
            password: 'salainen'
        }

        const result = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const newBlog = {
            title: "To be changed",
            author: "You",
            url: "localhost",
            likes: 1
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${result.body.token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const addedBlog = await Blog.find({ title: "To be changed" })
        expect(addedBlog[0].likes).toBe(1)

        const changedBlog = {
            title: "To be changed",
            author: "You",
            url: "localhost",
            likes: 9
        }

        await api
            .put(`/api/blogs/${addedBlog[0].id}`)
            .send(changedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const resultBlog = await Blog.find({ title: "To be changed" })
        expect(resultBlog[0].likes).toBe(9)
    })

    test('a valid blog without authentication can\'t be added', async () => {
        const newBlog = {
            title: "A title",
            author: "You",
            url: "localhost",
            likes: 4
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

describe('when there is initally one user in the database', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('password', 10)
        const user = new User({ username: 'root', password: passwordHash })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username not long enough', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('(`ro`) is shorter than the minimum allowed length (3)')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username doesn\'t exist', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password not long enough', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'test',
            name: 'Test name',
            password: 'sa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password shorter than 3 characters')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password doesn\'t exist', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'test',
            name: 'Test name'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password missing')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})

afterAll(() => {
    mongoose.connection.close()
})