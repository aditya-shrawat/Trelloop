


export const fetchUserInfo = async (req,res)=>{
    try {
        const user = req.user;
        // console.log(user)
        return res.status(200).json({message:"User fetched.",user});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

