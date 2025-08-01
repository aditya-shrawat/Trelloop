
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
        {type:String}
    ],
    deadline:{
        type:Date,
    },
    members:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User' }
    ],
    cover:{
        type:String,default:null,
    }
},{timestamps:true,})


const Card = mongoose.model('Card',cardSchema) ;

export default Card ;


