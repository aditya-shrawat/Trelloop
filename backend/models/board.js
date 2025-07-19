
import mongoose from 'mongoose'

const boardSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Workspace',
        required:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true,
    },
    members:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    pendingRequests: [
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    pendingInvites: [
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    visibility:{ 
        type:String, 
        default:'Workspace' 
    },
    background:{
        type:String,default:'#2980b9'
    }
},{timestamps:true,})


const Board = mongoose.model('Board',boardSchema) ;

export default Board ;


