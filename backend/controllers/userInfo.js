


export const fetchUserInfo = async (req,res)=>{
    try {
        const user = req.user;
        return res.status(200).json({message:"User fetched.",user});
    } catch (error) {
        console.log("Error fetching user info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

