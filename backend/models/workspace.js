
import mongoose from 'mongoose'

const workspaceSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    description:{
        type:String,required:false,unique:false,default:"" 
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true,
    },
    members:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    pendingInvites: [
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    isPrivate:{ 
        type:Boolean, 
        default:true 
    },
},{timestamps:true,})


const Workspace = mongoose.model('Workspace',workspaceSchema) ;

export default Workspace ;


