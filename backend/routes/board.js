
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { createBoard, fetcheBoards, getBoardData } from '../controllers/board.js';
import { creatingNewList } from '../controllers/list.js';

const router = express.Router();

router.get("/:workspaceId/boards",checkAuthentication,fetcheBoards)
router.post("/new",checkAuthentication,createBoard);
router.get("/:name/:id",checkAuthentication,getBoardData)

router.post("/:boardId/newList",checkAuthentication,creatingNewList)


export default router;

