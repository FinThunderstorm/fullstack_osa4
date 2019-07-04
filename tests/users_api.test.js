const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({})
  const user = new User(helper.initialUsers[0])
  await user.save()
})

describe('HTTP GET -tests', () => {
  test('returns json data with status 200', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns right amount of users', async () => {
    const res = await api.get('/api/users')

    expect(res.body.length).toBe(helper.initialUsers.length)
  })
})

describe('HTTP POST -tests', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: 'tualanen',
      name: 'Tuomas Alanen',
      password: 'salasana'
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('can not add user if already add', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'root user',
      password: 'salsasanoitus'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})



afterAll(() => {
  mongoose.connection.close()
})