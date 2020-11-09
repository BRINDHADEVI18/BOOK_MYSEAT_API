const mongoose=require('mongoose');
const User = require('./user')

const ticketSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    seat_no: {type:Number,min:1,max:40,required:true,unique:true},
    is_available:{ type: Boolean,default:true},
    passenger:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
   
});
module.exports=mongoose.model('Ticket',ticketSchema);