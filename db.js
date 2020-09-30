const fastify = require('fastify')

const fastifyPlugin = require('fastify-plugin')

const mongoose = require('mongoose');
async function dbConnector(fastify, options) {
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myfamily', { useNewUrlParser: true } )
    .then((data) => {
        console.log('MongoDb is connected succesfully')
    })
    .catch((err) => {
        console.log('Unable to connect', err)
    })
}
module.exports = fastifyPlugin(dbConnector)
