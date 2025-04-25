
import mongoose from 'mongoose'

const listSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    board:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'Board',
        required:true,
    }
},{timestamps:true,})


const List = mongoose.model('List',listSchema) ;

export default List ;


