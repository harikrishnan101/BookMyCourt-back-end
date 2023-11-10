const mongoose=require('mongoose')
const courtScheduleSchema=mongoose.Schema({

date:{
    type:Date,
    require:true,
},
slot:{
    type:Object,
    require:true
},
cost:{
    type:Number,
    require:true
},
bookedBY:{
    type:mongoose.Types.ObjectId,
    ref:'users'
},
cancellation:{
    type:Array

},
courtId:{
    type:mongoose.Types.ObjectId,
    ref:'users'
},
paymentOrders:{
    type:Array
}

})

const courtSchedules=mongoose.model('CourtSchedules',courtScheduleSchema)
module.exports=courtSchedules