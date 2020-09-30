const fastify = require('fastify')({
  logger: true
})


//require and us external files
fastify.register(require('../db'))
fastify.register(require('./routes'))



 
// Run the server!
fastify.listen(3000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})