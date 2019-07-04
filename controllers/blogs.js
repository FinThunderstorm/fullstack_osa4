const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
  })

  if(blog.likes === undefined){
    blog.likes = 0
  } else {
    blog.likes = body.likes
  }

  if(blog.title === undefined || blog.url === undefined) {
    return res.status(400).json({
      error: 'title or url missing'
    })
  }

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog.toJSON())
})

module.exports = blogsRouter