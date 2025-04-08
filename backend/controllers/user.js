import User from '../models/user.js';
import bcrypt from 'bcrypt'
import { createToken } from '../services/authentication.js';


export const handleSignup = async (req,res)=>{
    try {
        const {name,email,password} = req.body ;

        if(email==='' || password ==='' || name ===''){
            return res.status(400).json({error:"All fields are required!"})
        }

        const user = await User.findOne({email}) ;
        if(user){
            return res.status(400).json({error:"Email already in use!"});
        }
        if(password.length < 8){
            return res.status(400).json({error:'Password must be at least 8 characters!'})
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const newUser = await User.create({
            name,email,password:hashedPassword
        })

        const token = createToken(newUser) ;

        return res.status(201).cookie('token',token).json({message:"Sign up successfull."})
    } catch (error) {
        console.log("Error in signup -",error)
        return res.status(500).json({error:"Internal server error."});
    }
}


export const handleSignIn = async  (req,res)=>{
    try {
        const {email,password} = req.body ;

        if(email==='' || password ===''){
            return res.status(400).json({error:"All fields are required!"})
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User doesn't exist."});
        }

        const isPasswordSame = await bcrypt.compare(password,user.password);
        if(!isPasswordSame){
            return res.status(400).json({error:"Password is incorrect!"});
        }

        const token = createToken(user);

        return res.status(200).cookie('token',token).json({message:"Sign in successfully."})
    } catch (error) {
        console.log("Error in signin -",error)
        return res.status(500).json({error:"Internal server error."});
    }
}

