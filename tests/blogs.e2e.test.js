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
  })
})
