
import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema({
    workspace:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Workspace',
        required:true,
    },
    board:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Board',
    },
    card:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Card',
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true,
    },
    receiver:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        required:true 
    },
    content: {
        type:String,require:true,
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    }
},{timestamps:true,}) 


const Comment = mongoose.model('Comment',CommentSchema) ;

export default Comment ;


