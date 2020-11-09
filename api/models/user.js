const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
});

module.exports=mongoose.model('User',userSchema);