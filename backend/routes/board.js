
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { allJoinedWorkspacesAndBoards, changeVisibility, deleteBoard, getBoardData, getBoardStarStatus, getStarredBoards, toggleBoardStarStatus } from '../controllers/board.js';
import { creatingNewList } from '../controllers/list.js';
import checkBoardAccess from '../middlewares/checkBoardAccess.js';
import { fetchAllLists } from '../controllers/list.js';
import { creatingNewCard, fetchListCards } from '../controllers/card.js';

const router = express.Router();

router.get("/starred",checkAuthentication,getStarredBoards)
router.get("/myBoards",checkAuthentication,allJoinedWorkspacesAndBoards)

router.post("/:boardId/visibility",checkAuthentication,checkBoardAccess,changeVisibility)
router.get("/:boardId/starred",checkAuthentication,getBoardStarStatus)
router.post("/:boardId/starred",checkAuthentication,toggleBoardStarStatus)
router.delete("/:boardId/delete",checkAuthentication,checkBoardAccess,deleteBoard)

router.post("/:boardId/newList",checkAuthentication,checkBoardAccess,creatingNewList)
router.get("/:boardId/lists",checkAuthentication,checkBoardAccess,fetchAllLists)
router.post("/:boardId/list/:listId/newCard",checkAuthentication,checkBoardAccess,creatingNewCard)
router.get("/:boardId/list/:listId/cards",checkAuthentication,checkBoardAccess,fetchListCards)

router.get("/:name/:boardId",checkAuthentication,checkBoardAccess,getBoardData)
export default router;

