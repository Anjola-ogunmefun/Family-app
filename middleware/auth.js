require('dotenv').config();
const jwt = require('jsonwebtoken')
const fastify = require('fastify')()

module.exports = function authenticateToken(req, reply, next) {
    const authHeader = req.headers['authorization'] || req.headers["x-access-token"] 
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return reply.status(401).send({
        error: true,
        code:401,
        message: 'Unauthorized request'
    })
    else{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      console.log(err)
      if (err) return reply.status(403).send({
          error: true,
          code:403,
          message:'Invalid token'
      }) 
      next()
        })
    }
  }