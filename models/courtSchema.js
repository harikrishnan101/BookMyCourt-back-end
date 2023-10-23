const mongoose = require('mongoose')
const courtSchema = mongoose.Schema({

    name: {
        type: String,
        required: true

    },
    location: {
        type: String,
        required: true
        


    },
    cost: {
        type: String,
        required: true
        

    },
    about: {
        type: String,
        required: true

    },
    image:{
    type:String

    },

userId:{
    type:mongoose.Types.ObjectId,
    ref:'users'
} 
   
})
const court=mongoose.model('courts',courtSchema)
module.exports=court