require('dotenv').config();

const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fastify = require('fastify')()
const auth = require('../middleware/auth')
fastify.register(require('fastify-xml-body-parser'))


async function authRoutes (fastify, options) {
    fastify.post('/sign_up', async (req, reply) => {
        try{
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword
            }
            
            return User.create(user)
            .then((data) => {
                console.log('Thank you for signing up to our platform', data)
                reply.status(200).send({
                    code: 200,
                    error: false,
                    message: data
                })
            })
        }
        catch(err){
            console.log('An error occured', err)
            return reply.status(500).send({
             code: 500,
             error: true,
             message: err
             });
        }
    })


    const issuer = 'Standarrd creatives';
    const subject = 'access token';

    const claims ={
        issuer,
        subject,
        expiresIn:'2m'
    };

    fastify.post('/login', async (req, reply) => {
        try{
            const { userName, password} = req.body
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await bcrypt.compareSync(password, hashedPassword);

            console.log('user', user)
                    
            if(!password || !userName){
                return reply.send({
                    code: 400,
                    error: true,
                    messae:'Password or user name field cannot be empty'
                })
            }

            if(user == null){
                console.log('User not found!')
                return reply.send('Cannot find user')
            }

            function generateAccessToken({claims}) {
                return jwt.sign({claims}, process.env.ACCESS_TOKEN_SECRET)
            }

            if(userName  && user == true ){
                const name = userName               
                const token = generateAccessToken({claims}) 
                console.log('token', token)

                return reply.header("x-auth-token", token).send(`Welcome ${name}!`) 
            }
            
            else{
                return reply.send({
                    code: 400,
                    error: true,
                    message:'Wrong user name or password!'
                })
            }
        }
        catch(error){
            console.log('An error occured!', error)
           return reply.status(400).send({
                code: 400,
                error: true,
                error
            })
        }


    })



    fastify.post('/refresh_token', {auth} , (req, reply) =>{
        function generateAccessToken({claims}) {
        return jwt.sign({claims}, process.env.REFRESH_TOKEN_SECRET)
        }
        try{
        const token = generateAccessToken({claims}) 
        console.log('token', token)
        return reply.header("x-auth-token", token).send({
            error: false,
            code:200,
            token
        })
        }
        catch(err){
        console.log('An error occured', err)
        return reply.send(err)
        }
    })

    

}

module.exports = authRoutes



