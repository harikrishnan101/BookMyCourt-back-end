const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    firstname: {
        type: String,
        required: true

    },
    lastname: {
        type: String,
        required: true
        


    },
    email: {
        type: String,
        required: true,
        unique:true

    },
    password: {
        type: String,
        required: true

    },
    role:{
    type:Number,
    default:1
    }
   
})
const user=mongoose.model('users',userSchema)
module.exports=user