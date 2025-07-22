import express from 'express'
import checkAuthentication from '../middlewares/authentication.js'
import { addAttachment, addNewCardMembers, changeCardCover, deleteAttachment, deleteCard, fetchCardActivity, fetchCardData, joinCard, leaveCard, removeCardCover, removeCardMember, updateAttachment, updateCard, updateCardStatus, updateDeadline } from '../controllers/card.js';
import checkCardAccess from '../middlewares/checkCardAccess.js';
import { postCommentReply } from '../controllers/comment.js';


const router = express.Router()


router.get("/:cardId",checkAuthentication,checkCardAccess,fetchCardData)

router.get("/activities/:cardId",checkAuthentication,checkCardAccess,fetchCardActivity)

router.patch("/:cardId",checkAuthentication,checkCardAccess,updateCard)
router.delete("/:cardId/delete",checkAuthentication,checkCardAccess,deleteCard)

router.patch("/:cardId/isCompleted",checkAuthentication,checkCardAccess,updateCardStatus) 
router.patch("/:cardId/deadline",checkAuthentication,checkCardAccess,updateDeadline)
router.patch("/:cardId/add-members",checkAuthentication,checkCardAccess,addNewCardMembers)
router.patch("/:cardId/join",checkAuthentication,checkCardAccess,joinCard)
router.patch("/:cardId/remove-member",checkAuthentication,checkCardAccess,removeCardMember)
router.patch("/:cardId/leave",checkAuthentication,checkCardAccess,leaveCard)
router.patch("/:cardId/set-cover",checkAuthentication,checkCardAccess,changeCardCover)
router.patch("/:cardId/remove-cover",checkAuthentication,checkCardAccess,removeCardCover)

router.patch("/:cardId/attachments",checkAuthentication,checkCardAccess,addAttachment)
router.patch("/:cardId/update/attachment",checkAuthentication,checkCardAccess,updateAttachment)
router.patch("/:cardId/delete/attachment", checkAuthentication,checkCardAccess,deleteAttachment);
  
router.post("/:cardId/comment/:commentId/reply",checkAuthentication,checkCardAccess,postCommentReply);


export default router

