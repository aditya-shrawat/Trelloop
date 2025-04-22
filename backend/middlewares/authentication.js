import { verifyToken } from "../services/authentication.js";


const checkAuthentication = (req,res,next)=>{
    try {
        const token = req.cookies['token'];

        if(!token){
            return res.status(400).json({error:"token is not present or expired"}) ;
        }

        const payload = verifyToken(token)
        req.user = payload;
        next()
    } catch (error) {
        return res.status(500).json({error: "Unauthorized: invalid token" })
    }
}

export default checkAuthentication


