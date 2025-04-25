
import mongoose from 'mongoose'

const cardSchema = mongoose.Schema({
    name:{
        type:String,required:true,unique:false,
    },
    list:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'List',
        required:true,
    }
},{timestamps:true,})


const Card = mongoose.model('Card',cardSchema) ;

export default Card ;


