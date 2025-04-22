
import express from 'express'
import checkAuthentication from '../middlewares/authentication.js';
import { createWorkspace, fetchWorkspaces } from '../controllers/workspace.js';

const route = express.Router();


route.get('/',checkAuthentication,fetchWorkspaces)
route.post('/new',checkAuthentication,createWorkspace)


export default route
