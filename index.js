
//npm run start:dev
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let increment = 1;
let users = [];

//middleware logger

const logger = ((req, res, next) => {
    const reqTime = Date.now()

    res.on('finish', () => {
        console.log(`[${new Date()}] ${req.ip} ${Date.now() - reqTime}ms ${req.method} ${req.originalUrl}`)
    })
    next()
})

// middleware error
const catchError = ((req, res, next) => {
    
    res.on('finish', () => {
        
    })
    next()
})

app.use(logger)
app.use(catchError)


//get users
app.get('/users', (req, res) => {
    res.send(users).status(200)
  })

  //create user
app.post('/post/users', (req, res) => {
   
    const user = req.body;

    user.id = increment;

    users.push(user)
    increment++

    res.sendStatus(200)
  })


  //get firstname
  app.get('/users/:firstName', (req, res) => {
    if(req.params.firstName){
    const firstName = req.params.firstName; 
    const user = users.find(user => user.firstName === firstName)
    res.send(user).sendStatus(200)
    } else{
        res.sendStatus(400)
    }
  })

  //update user
  app.put('/update/users/:id', (req, res) => {
    if(req.params.id){
        const id = parseInt(req.params.id); 
        const update = {...req.body, id}
        let findIndex = users.findIndex(x => x.id == id)
        users[findIndex] = update
        res.send(update).sendStatus(200)
    } else{
        res.sendStatus(400)
    }
  })

  // get all users
  app.get('/all/users', (req, res) => {
    res.send(users).sendStatus(200)
  })

  //delete user
  app.delete('/delete/users/:id',  (req, res) => {
    if(req.params.id) {
        const id = parseInt(req.params.id)
        users = users.filter (user => user.id !== id)
    res.sendStatus(200)
    } else{
        res.sendStatus(400)
    }
  })

app.listen(port, (err) => {
  console.log(`Example app listening on port ${port}`)
  if (err) console.log(err);
   console.log("Server listening on port: ", port);
})
