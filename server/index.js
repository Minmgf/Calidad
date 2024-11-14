const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./models/User')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://usco:usco@cluster0.9ao6n.mongodb.net/users');

app.post('/login', (req,res) => {
    const {email, password} = req.body;
    UserModel.findOne({email:email})
    .then( user => {
        if(user){
            if(user.password === password){
                res.json('Success');
            }else{
                res.json('The password is not correct');
            }
        }else{
            res.json('Usuario no registrado')
        }
    })
})

app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.json(err))
})

app.listen( 3001, () => {
    console.log('Server is running')
})