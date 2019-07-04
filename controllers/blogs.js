const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1})
  res.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (req, res, next) => {
  const body = req.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id
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
  try{
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog.toJSON())
  } catch(e){
    next(e)
  }
  
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {new: true})
  res.json(updatedBlog.toJSON())

})

module.exports = blogsRouter