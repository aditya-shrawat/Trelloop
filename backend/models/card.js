
import mongoose from 'mongoose'

const cardSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    description:{
        type:String, required:false,unique:false,
        default:""
    },
    list:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'List',
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
    },
    isCompleted:{
        type:Boolean,required:false,
        default:false
    },
    attachments:[
        String
    ]
},{timestamps:true,})


const Card = mongoose.model('Card',cardSchema) ;

export default Card ;


