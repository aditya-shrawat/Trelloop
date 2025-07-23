
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
    replyTo:{  // !== null  its a reply(stors parentComment sender) , === null its a parent comment (not get replied)
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        default:null
    },
    content: {
        type:String,require:true,
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    parentComment: { // !== null , its a reply , === null its a parent comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
},{timestamps:true,}) 


const Comment = mongoose.model('Comment',CommentSchema) ;

export default Comment ;


