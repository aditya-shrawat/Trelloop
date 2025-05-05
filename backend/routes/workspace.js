
import express from 'express'
import checkAuthentication from '../middlewares/authentication.js';
import { createWorkspace, deleteWorkspace, fetchWorkspaces, getWorkspaceData, updateWorkspace } from '../controllers/workspace.js';

const route = express.Router();


route.get('/',checkAuthentication,fetchWorkspaces)
route.post('/new',checkAuthentication,createWorkspace)

route.get('/:name/:id',checkAuthentication,getWorkspaceData)

route.patch('/update/:id',checkAuthentication,updateWorkspace)

route.delete('/delete/:id', checkAuthentication,deleteWorkspace);

export default route
