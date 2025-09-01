import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    clerkUserId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String,
        required: true  
    },
    profileImage:{
        type: String,
    },
    email:{
        type:String,required:true,unique:true,lowercase: true 
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
},{timestamps:true,});

const User = mongoose.model('User',UserSchema) ;

export default User ;


