import express from 'express'
import checkAuthentication from '../middlewares/authentication.js'
import { addAttachment, deleteAttachment, deleteCard, fetchCardActivity, fetchCardData, updateAttachment, updateCard, updateCardStatus } from '../controllers/card.js';
import checkCardAccess from '../middlewares/checkCardAccess.js';


const router = express.Router()


router.get("/:cardId",checkAuthentication,checkCardAccess,fetchCardData)

router.get("/activities/:cardId",checkAuthentication,checkCardAccess,fetchCardActivity)

router.patch("/:cardId",checkAuthentication,checkCardAccess,updateCard)
router.delete("/:cardId/delete",checkAuthentication,checkCardAccess,deleteCard)

router.patch("/:cardId/isCompleted",checkAuthentication,checkCardAccess,updateCardStatus) 

router.patch("/:cardId/attachments",checkAuthentication,checkCardAccess,addAttachment)
router.patch("/:cardId/update/attachment",checkAuthentication,checkCardAccess,updateAttachment)
router.patch("/:cardId/delete/attachment", checkAuthentication,checkCardAccess,deleteAttachment);
  


export default router

