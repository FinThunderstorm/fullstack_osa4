const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

const tokenExtractor = (req,res,next) => {
  
  const auth = req.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer')){
    req.token = auth.substring(7)
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}