const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await User.deleteMany({})
  const user = new User(helper.initialUsers[0])
  const res = await api
    .post('/api/users')
    .send(user)
  console.log('res',res.body)
})

describe('HTTP POST -tests', () => {
  test('login succesfull with right data', async () => {
    const loginUser = {
      username: 'root',
      password: 'root'
    }
  
    await api
      .post('/api/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(res => {
        res.username === 'root' && res.name === 'root user'
      })
      .expect(res => res.token !== undefined)
  })

  test('login with wrong password not possible', async () => {
    const loginUser = {
      username: 'root',
      password: 'salsasanoitus'
    }

    const res = await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('invalid username or password')
  })

  test('login with wrong username not possible', async () => {
    const loginUser = {
      username: 'root123',
      password: 'password'
    }

    const res = await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(res.body.error).toContain('invalid username or password')
  })
})



afterAll(() => {
  mongoose.connection.close()
})