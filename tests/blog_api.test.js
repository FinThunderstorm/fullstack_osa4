const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})

const api = supertest(app)
describe('HTTP GET -tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('there are 6', async () => {
    const res = await api.get('/api/blogs')
  
    expect(res.body.length).toBe(helper.initialBlogs.length)
  })
  
  test('there is a blog about react patterns', async () => {
    const res = await api.get('/api/blogs')
  
    const contents = res.body.map(r => r.title)
  
    expect(contents).toContain(
      'React patterns'
    )
  })

  test('there is a id, not _id', async () => {
    const res = await api.get('/api/blogs')

    const contents = res.body.map(r => r.id)

    expect(contents).toBeDefined()
  })
})

describe('HTTP POST -tests', () => {
  test('if is able to add valid blogs', async () => {
    const newBlog = {
      title: 'Testing is fun',
      author: 'Kasa Panos',
      url: 'https://www.varusmies.fi',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(r => r.title)
    
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
    expect(contents).toContain(
      'Testing is fun'
    )
  })

  test('if likes undefined, automatically comes likes 0', async () => {
    const newBlog = {
      title: 'Testing is fun',
      author: 'Kasa Panos',
      url: 'https://www.varusmies.fi'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        res.body.likes = 0
      })
  })

  test('if title and url missing, comes status 400', async () => {
    const newBlog = {
      author: 'Kasa Panos',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

describe('HTTP DELETE -tests', () => {
  test('deleting id is okay', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const idToBeRemoved = blogsAtStart[0].id

    await api
      .delete(`/api/blogs/${idToBeRemoved}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)
  })
})

describe('HTTP PUT -tests', () => {
  test('updating id is okay', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const idToBeUpdated = blogsAtStart[0].id

    const updateBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10
    }

    await api
      .put(`/api/blogs/${idToBeUpdated}`)
      .send(updateBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        res.body.likes = updateBlog.likes
      })
  })

  test('updating not existing id throws 400 bad req', async () => {
    const id = helper.nonExistingId
    
    const updateBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 10
    }

    await api
      .put(`/api/blogs/${id}`)
      .send(updateBlog)
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})