const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const morgan = require('morgan')
const middleware = require('./utils/middleware')

console.log('connecting to', config.MONGODB_URI, config.PORT)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

morgan.token('body', (req) => { return JSON.stringify(req.body) })

app.use(morgan('dev', {
  skip: (req, res) => { return res.statusCode !== 400 }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  //skip: (req,res) => { return res.statusCode === 400 }
}))

app.use(cors())
app.use(middleware.tokenExtractor)
app.use(bodyParser.json())


app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app