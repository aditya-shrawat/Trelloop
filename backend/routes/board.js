
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { addNewMembers, allJoinedWorkspacesAndBoards, changeBoardBackground, changeVisibility, deleteBoard, fetchBoardMembers, getBoardActivies, getBoardData, getBoardStarStatus, getSharedBoards, getStarredBoards, joinMemberInBoard, leaveBoard, removeBoardMember, renameBoard, toggleBoardStarStatus } from '../controllers/board.js';
import { creatingNewList, deleteList, updateList } from '../controllers/list.js';
import checkBoardAccess from '../middlewares/checkBoardAccess.js';
import { fetchAllLists } from '../controllers/list.js';
import { creatingNewCard, fetchListCards } from '../controllers/card.js';

const router = express.Router();

router.get("/starred-boards",checkAuthentication,getStarredBoards)
router.get("/shared-boards",checkAuthentication,getSharedBoards)
router.get("/joined-workspaces-boards",checkAuthentication,allJoinedWorkspacesAndBoards)

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
router.patch("/:boardId/re-name",checkAuthentication,checkBoardAccess,renameBoard);
router.patch("/:boardId/change-background",checkAuthentication,checkBoardAccess,changeBoardBackground);

router.post("/:boardId/newList",checkAuthentication,checkBoardAccess,creatingNewList)
router.get("/:boardId/lists",checkAuthentication,checkBoardAccess,fetchAllLists)
router.post("/:boardId/list/:listId/newCard",checkAuthentication,checkBoardAccess,creatingNewCard)
router.get("/:boardId/list/:listId/cards",checkAuthentication,checkBoardAccess,fetchListCards)
router.patch("/:boardId/list/:listId/update",checkAuthentication,checkBoardAccess,updateList)
router.delete("/:boardId/list/:listId/delete",checkAuthentication,checkBoardAccess,deleteList)

router.get("/:name/:boardId",checkAuthentication,checkBoardAccess,getBoardData)
export default router;

