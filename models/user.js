const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose= require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});



userSchema.plugin(passportLocalMongoose); // apne aap ek username and hashed password generate kardega in schema also salting bhi 

module.exports= mongoose.model('User',userSchema);