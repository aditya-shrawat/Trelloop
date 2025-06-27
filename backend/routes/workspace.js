
import express from 'express'
import checkAuthentication from '../middlewares/authentication.js';
import { createWorkspace, deleteWorkspace, fetchWorkspaceMembers, fetchWorkspaces, getWorkspaceData, updateWorkspace, updateWorkspaceVisibility } from '../controllers/workspace.js';
import { fetcheBoards } from '../controllers/board.js';
import checkWorkspaceAccess from '../middlewares/checkWorkspaceAccess.js';

const route = express.Router();


route.get('/',checkAuthentication,fetchWorkspaces)
route.post('/new',checkAuthentication,createWorkspace)
route.get("/:id/boards",checkAuthentication,checkWorkspaceAccess,fetcheBoards) 

route.get('/:name/:id',checkAuthentication,checkWorkspaceAccess,getWorkspaceData)
route.get('/:name/:id/members',checkAuthentication,checkWorkspaceAccess,fetchWorkspaceMembers)

route.patch('/update/:id',checkAuthentication,checkWorkspaceAccess,updateWorkspace)

route.delete('/delete/:id', checkAuthentication,checkWorkspaceAccess,deleteWorkspace);
route.patch('/visibility/:id',checkAuthentication,checkWorkspaceAccess,updateWorkspaceVisibility)

export default route 
