//models/User.js
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    admin: {
        type: String,
        default: "false"
    }
})

module.exports =  mongoose.model("User", UserSchema)
