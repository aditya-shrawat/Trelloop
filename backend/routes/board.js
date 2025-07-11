
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { addNewMembers, allJoinedWorkspacesAndBoards, changeVisibility, deleteBoard, fetchBoardMembers, getBoardActivies, getBoardData, getBoardStarStatus, getStarredBoards, joinMemberInBoard, leaveBoard, removeBoardMember, toggleBoardStarStatus } from '../controllers/board.js';
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
router.get("/:boardId/activities",checkAuthentication,checkBoardAccess,getBoardActivies)
router.post("/:boardId/join",checkAuthentication,checkBoardAccess,joinMemberInBoard);
router.get("/:boardId/members",checkAuthentication,checkBoardAccess,fetchBoardMembers);
router.post("/:boardId/add-members",checkAuthentication,checkBoardAccess,addNewMembers);
router.post("/:boardId/remove-member",checkAuthentication,checkBoardAccess,removeBoardMember);
router.post("/:boardId/leave-board",checkAuthentication,checkBoardAccess,leaveBoard);

router.post("/:boardId/newList",checkAuthentication,checkBoardAccess,creatingNewList)
router.get("/:boardId/lists",checkAuthentication,checkBoardAccess,fetchAllLists)
router.post("/:boardId/list/:listId/newCard",checkAuthentication,checkBoardAccess,creatingNewCard)
router.get("/:boardId/list/:listId/cards",checkAuthentication,checkBoardAccess,fetchListCards)

router.get("/:name/:boardId",checkAuthentication,checkBoardAccess,getBoardData)
export default router;

