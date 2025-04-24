
import mongoose from 'mongoose'

const boardSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Workspace',
        required:true,
    }
},{timestamps:true,})


const Board = mongoose.model('Board',boardSchema) ;

export default Board ;


