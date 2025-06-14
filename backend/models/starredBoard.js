import mongoose from "mongoose";

const StarredBoardSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    }
},{timestamps:true,});


const StarredBoard = mongoose.model("StarredBoard", StarredBoardSchema);

export default StarredBoard ;
