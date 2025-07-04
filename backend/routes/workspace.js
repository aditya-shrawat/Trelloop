
import express from 'express'
import checkAuthentication from '../middlewares/authentication.js';
import { createWorkspace, deleteWorkspace, fetchWorkspaceMembers, fetchWorkspaces, getWorkspaceActivies, getWorkspaceData, leaveWorkspace, removeWorkspaceMember, updateWorkspace, updateWorkspaceVisibility } from '../controllers/workspace.js';
import { createBoard, fetcheBoards } from '../controllers/board.js';
import checkWorkspaceAccess from '../middlewares/checkWorkspaceAccess.js';

const route = express.Router();


route.get('/',checkAuthentication,fetchWorkspaces)
route.post('/new',checkAuthentication,createWorkspace)
route.post("/:id/newBoard",checkAuthentication,checkWorkspaceAccess,createBoard);
route.get("/:id/activities",checkAuthentication,checkWorkspaceAccess,getWorkspaceActivies)
route.get("/:id/boards",checkAuthentication,checkWorkspaceAccess,fetcheBoards) 

route.get('/:name/:id',checkAuthentication,checkWorkspaceAccess,getWorkspaceData)
route.get('/:name/:id/members',checkAuthentication,checkWorkspaceAccess,fetchWorkspaceMembers)

route.patch('/update/:id',checkAuthentication,checkWorkspaceAccess,updateWorkspace)

route.delete('/delete/:id', checkAuthentication,checkWorkspaceAccess,deleteWorkspace);
route.patch('/visibility/:id',checkAuthentication,checkWorkspaceAccess,updateWorkspaceVisibility)
route.post("/:id/remove-member",checkAuthentication,checkWorkspaceAccess,removeWorkspaceMember)
route.post("/:id/leave-workspace",checkAuthentication,checkWorkspaceAccess,leaveWorkspace)

export default route 
