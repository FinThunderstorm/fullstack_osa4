const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  console.log('username', body.username)
  console.log('password',body.password)
  const user = await User.findOne({ username: body.username })
  console.log('user', user)
  console.log('userHash', user.passwordHash)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if(!(user && passwordCorrect)){
    return res
      .status(401)
      .json({
        error: 'invalid username or password'
      })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // eslint-disable-next-line no-undef
  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter