
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { createBoard, fetcheBoards, getBoardData } from '../controllers/board.js';

const router = express.Router();

router.get("/:workspaceId/boards",checkAuthentication,fetcheBoards)
router.post("/new",checkAuthentication,createBoard);
router.get("/:name/:id",checkAuthentication,getBoardData)


export default router;

