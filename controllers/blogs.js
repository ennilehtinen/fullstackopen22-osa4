const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog(body)

  if (!blog.title || !blog.url) {
    response
      .status(400)
      .json({ error: true, message: 'Missing required parameter' })
    return
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  blog.user = user._id

  const newBlog = await blog.save()

  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  const blogObject = await Blog.findById(blog.id).populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(blogObject)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'no permissions' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
)

blogsRouter.patch(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    const allowedKeys = ['title', 'url', 'likes', 'author']

    allowedKeys.map(key => {
      blog[key] = request.body[key] ?? blog[key]
    })

    await blog.save()

    response.status(200).json(blog)
  }
)

module.exports = blogsRouter
