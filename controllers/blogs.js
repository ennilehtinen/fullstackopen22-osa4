const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    response
      .status(400)
      .json({ error: true, message: 'Missing required parameter' })
    return
  }

  if (!blog.likes) {
    blog.likes = 0
  }

  const newBlog = await blog.save()
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
