
import mongoose from 'mongoose'

const ActivitySchema = mongoose.Schema({
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
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true,
    },
    type:{ 
        type:String, 
        required:true //card_mark, card_rename, baord_rename,card_created,list_created,.. etc.
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            //cardName:name,cardId:id,boardName:name,.. etc.
        },
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    }
},{timestamps:true,})


const Activity = mongoose.model('Activity',ActivitySchema) ;

export default Activity ;


