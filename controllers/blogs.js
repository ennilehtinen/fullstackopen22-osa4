const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.patch('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const allowedKeys = ['title', 'url', 'likes', 'author']

  allowedKeys.map(key => {
    blog[key] = request.body[key] ?? blog[key]
  })

  await blog.save()

  response.status(200).json(blog)
})

module.exports = blogsRouter
