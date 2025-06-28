
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { allJoinedWorkspacesAndBoards, createBoard, getBoardData, getBoardStarStatus, getStarredBoards, getWorkspaceInfoByBoard, toggleBoardStarStatus } from '../controllers/board.js';
import { creatingNewList } from '../controllers/list.js';
import checkWorkspaceAccess from '../middlewares/checkWorkspaceAccess.js';

const router = express.Router();

router.post("/new",checkAuthentication,createBoard);

router.get("/:id/starred",checkAuthentication,getBoardStarStatus)

router.get("/starred",checkAuthentication,getStarredBoards)

router.get("/:id/workspace-info",checkAuthentication,getWorkspaceInfoByBoard)

router.get("/:name/:id",checkAuthentication,getBoardData)

router.post("/:boardId/newList",checkAuthentication,creatingNewList)

router.post("/:id/starred",checkAuthentication,toggleBoardStarStatus)

router.get("/myBoards",checkAuthentication,allJoinedWorkspacesAndBoards)


export default router;

