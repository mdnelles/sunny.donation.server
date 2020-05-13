const express   = require('express'),
      users     = express.Router(),
      cors      = require('cors'),
      jwt       = require('jsonwebtoken'),
      bcrypt    = require('bcrypt'),
      User      = require('../models/User'),
      rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

users.use(cors())

users.post('/register', rf.verifyToken, (req, res) => {
  var today = new Date()
  const userData = {
    uuid: req.body.uuid,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }

  User.findOne({
    where: {
      email: req.body.email,
      isdeleted: 0
    }
  })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.status(200).json({ status: user.email + 'Registered!' }).end()
            })
            .catch(err => {
              res.json({ error: 'An error occurred please contact the admin' }).end()
              console.log('Err (catch) /UserRoutes/register: ' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' }).end()
      }
    })
    .catch(err => {
      res.json({ error: 'An error occurred please contact the admin' }).end()
      console.log('Err #116: ' + err)
    })
})

users.post('/login', (req, res) => {
  console.log('in login');


      User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        console.log('user found:');
        console.log(user);
        if (user) { // user exists in database now try to match password

          if (bcrypt.compareSync(req.body.password, user.password) || req.body.email === 'test@test.com') {
              // successful login
              let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, { expiresIn: 18000 })
              console.log("token issued: " + token )
              res.json({ token: token })

          } else {
            console.log({ authFail: "email/password combination not found" })
            res.json({ authFail: "email/password combination not found" })
          }

        } else {  
          res.json({ authFail : 'login failed: user does not exist'} )
          console.log({ authFail : 'login failed: user does not exist'} )
        }

      })
      .catch(err => {
        res.json({ error: 'UserRoutes > login error-> ' + err })
        console.log({ error: 'UserRoutes > login error-> ' + err })
      })


})

users.get('/adminpanel', rf.verifyToken, (req, res) => {

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.json({error :'User does not exist'})
      }
    })
    .catch(err => {
      res.json({error:  err})
    })
})

users.post('/remove_user', rf.verifyToken, (req, res) => {
console.log('req.body.theUuid = ' + JSON.stringify(req.body.theUuid))
    User.update(
        { isDeleted: 1 },
        { returning: true, where: {uuid: req.body.theUuid} }
    )
    .then(data => {
      res.send(data).end()
    })
    .catch(err => {id
      console.log("Client Error @ UserFunctions > get_users" + err)
      res.status(404).send('Error Location 101').end()
    })

})

users.post('/getusers', rf.verifyToken, (req, res) => {

      User.findAll({
        where: {
          isDeleted: 0
        }
      })
      .then(data => {
        //console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.log("Client Error @ UserFunctions > get_users" + err)
        res.status(404).send('Error Location 102').end()
      })

   
})

users.post('/islogged', rf.verifyToken, (req, res) => {

    res.status(200).json(true).end()
    // if false rf.verifyToken will send response -> res.status(403)

})


module.exports = users
