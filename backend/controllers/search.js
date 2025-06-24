import User from "../models/user.js";


export const searchUsers = async (req,res)=>{
    try {
        const {query} = req.query ;

        if(!query){
            return res.status(400).json({error:"Search query is required"});
        }

        const users = await User.find({
            name:{ $regex: query, $options: "i" }
        }).select("name")

        return res.status(200).json({message:"Users searched.",users});
    }catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
