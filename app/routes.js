const fastify = require('fastify')()
fastify.register(require('fastify-xml-body-parser'))

//import model
const FamilyModel = require("../models/family");

async function routes (fastify, options) {
 //base route to the app
  fastify.get('/', (request, reply) => {
    reply.send('Welcome to an app built with fastify!')
  })

  //Route to add new family member 
  fastify.post('/add_member', async (req, reply) => {
    try {
      const { name, gender, age, email, phoneNumber} = req.body 

          //checks if the request body is empty
        if(Object.keys(req.body).length === 0){
          console.log('Field cannot be empty!')
          return reply.send({
            error: true,
            code: 400,
            message: "Field cannot be empty!"
          })
        }
        //declaration of required fields
        if(!name || !gender || !age || !email || !phoneNumber){
         return reply.status(400).send({
            error: true,
            code: 400,
            message: "A required field is missing"
          })
        }

        const newMember = {
          name,
          gender,
          age,
          email,
          phoneNumber
        }

        //connects to the database to create and save inputs for newMember
        return FamilyModel.create(newMember)
          .then((data) => {
            console.log('New mwmber has been added', data)
            reply.status(200).send({
              error: false,
              code: 200,
              message: `${name} has been added to the family`,
              data
            })
          })
      }
      catch(error){
       console.log('There was an error adding member', error)
        return reply.status(500).send({
         code: 500,
         error: true,
         message: "Could not save record!"
         });
      }
    })


    //find one member by email
    fastify.get('/find_member/:email', async (req, reply) => {
    try{ 
        
        const { email } = req.params   // takes email as a parameter variable
    
          const familyMember = await FamilyModel.findOne({email})
          console.log(familyMember)
          
          if(!email){
              console.log("please add email")
              return reply.status(400).send({
                  error: true,
                  code: 400,
                  message: "please add email"
              })
          }
  
          if(!familyMember){
              console.log("member not found!")
              return reply.status(400).send({
                  error: true,
                  code: 400,
                  message: "Member not found!"
              })
          }
          
       if(familyMember){
          console.log(familyMember)
           return reply.status(200).send({
            error: false,
            code: 200,
            familyMember
            })
        }
    }
    catch(err){
        console.log('error', err)
        return reply.status(500).send({
            error: true,
            code: 500,
            message: "Internal server error"
        })
    }
  })


  //Route to fetch all family member entries
  fastify.get('/all_members', async (req, reply) => {
    try{ 
    
      const familyRecord = await FamilyModel.find()

      if(familyRecord.length === 0){
        return reply.status(204).send({
          error: true,
          code: 204,
          message:'Family record is empty!'
        })
      }
        else{
          console.log(familyRecord)
           return reply.status(200).send({
            error: false,
            code: 200,
            familyRecord
            })
        }
    }catch(err){
        console.log('error', err)
        return reply.status(500).send({
            error: true,
            code: 500,
            message: "Internal server error"
        })
    }
  })


  //Find a member and update details by email
  fastify.post('/update_member', async (req, reply) => {
      try{
        const { name, age, gender} = req.body
        let params = { //expected update inputs
          name,
          age,
          gender
         };

      if(name !== undefined){
          params.name = name
      };

      if(age !== undefined){
          params.age = age;
      };

      if(gender !== undefined){
          params.gender = gender;
      };


        const {email} = req.query

        const familyMember = await FamilyModel.findOneAndUpdate({email}, {$set: params}, {new: true}) //finds,updates and appends the new inputs

        if(!familyMember){
          return reply.status(204).send({
            error: true,
            code: 204,
            message:'Family member not found!'
          })
        }
        else{
          console.log(familyMember)
           return reply.status(200).send({
            error: false,
            code: 200,
            familyMember
            })
        }
      }
      catch(err){
        console.log('error', err)
        return reply.status(500).send({
            error: true,
            code: 500,
            message: "Internal server error"
        })
      }

    })


    //find family member by email and delete
    fastify.delete('/delete_member', async (req, reply) => {
      const { email } = req.query
      const familyMember = await FamilyModel.findOneAndDelete({email})

      try{
        if(!email){
          console.log("Please add email")
          return reply.status(400).send({
            error: true,
            code: 400,
            message:"Please add email"
          })
        }
        else{
          console.log('member deleted', familyMember)
          return reply.status(200).send({
            error: false,
            code: 200,
            message: `${familyMember.name} has been deleted from the family`,
            familyMember
          })
        }

      }
      catch(err){
        console.log('error', err)
        return reply.status(500).send({
            error: true,
            code: 500,
            message: "Internal server error"
        })
      }
    })


}

  module.exports = routes
  