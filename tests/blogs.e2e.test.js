const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Enni',
    url: 'http://google.com',
    likes: 123
  },
  {
    title: 'React is easier',
    author: 'Enni',
    url: 'http://google.com',
    likes: 321
  }
]

describe('blogs e2e', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

  afterAll(() => {
    mongoose.connection.close()
  })

  test('blogs are returned as json', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogs.body[0].title).toBe(initialBlogs[0].title)
    expect(blogs.body[1].title).toBe(initialBlogs[1].title)
    expect(blogs.body.length).toBe(initialBlogs.length)

    expect(blogs.body[0].id).toBeDefined()
  })

  test('new blog is created', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'New blog',
        author: 'Enni',
        url: 'http://google.com'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogs.body.length).toBe(initialBlogs.length + 1)
    expect(blogs.body[initialBlogs.length].title).toBe('New blog')
    expect(blogs.body[initialBlogs.length].likes).toBe(0)
  })

  test('new blog is not created when missing title or url', async () => {
    await api
      .post('/api/blogs')
      .send({
        author: 'Enni'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(blogs.body.length).toBe(initialBlogs.length)
  })

  test('blog is deleted', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api.delete(`/api/blogs/${blogs.body[0].id}`).expect(204)

    const remainingBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(remainingBlogs.body.length).toBe(initialBlogs.length - 1)
    expect(remainingBlogs.body[0].title).toBe(initialBlogs[1].title)
  })

  test('blog can be edited', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newTitle = 'Hello World!'
    const newLikes = 1000

    await api
      .patch(`/api/blogs/${blogs.body[0].id}`)
      .send({ title: newTitle, likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(newBlogs.body[0].title).toBe(newTitle)
    expect(newBlogs.body[0].likes).toBe(newLikes)
    expect(newBlogs.body[0].url).toBe(initialBlogs[0].url)
  })
})
