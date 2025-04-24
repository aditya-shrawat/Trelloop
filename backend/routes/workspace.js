
import express from 'express'
import checkAuthentication from '../middlewares/authentication.js';
import { createWorkspace, fetchWorkspaces, getWorkspaceData } from '../controllers/workspace.js';
import Workspace from '../models/workspace.js';

const route = express.Router();


route.get('/',checkAuthentication,fetchWorkspaces)
route.post('/new',checkAuthentication,createWorkspace)

route.get('/:name/:id',checkAuthentication,getWorkspaceData)


export default route
