
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { createBoard, getBoardData, getBoardStarStatus, getStarredBoards, toggleBoardStarStatus } from '../controllers/board.js';
import { creatingNewList } from '../controllers/list.js';

const router = express.Router();

router.post("/new",checkAuthentication,createBoard);

router.get("/:id/starred",checkAuthentication,getBoardStarStatus)

router.get("/starred",checkAuthentication,getStarredBoards)

router.get("/:name/:id",checkAuthentication,getBoardData)

router.post("/:boardId/newList",checkAuthentication,creatingNewList)

router.post("/:id/starred",checkAuthentication,toggleBoardStarStatus)


export default router;

