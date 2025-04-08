import express from 'express'
import { handleSignIn, handleSignup } from '../controllers/user.js';

const route = express.Router();

route.post('/signup',handleSignup)
route.post('/signin',handleSignIn)


export default route ;


