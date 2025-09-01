import express from 'express'
import { searchUsers } from '../controllers/search.js';
import {checkAuthentication} from '../middlewares/authentication.js';

const route = express.Router();

route.get('/global-users',checkAuthentication,searchUsers)


export default route ;

