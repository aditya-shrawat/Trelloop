import express from 'express'
import checkAuthentication from '../middlewares/authentication.js'
import { addAttachment, deleteAttachment, fetchCardActivity, fetchCardData, updateAttachment, updateCard, updateCardStatus } from '../controllers/card.js';
import Card from '../models/card.js';


const router = express.Router()


router.get("/:cardId",checkAuthentication,fetchCardData)

router.get("/activities/:cardId",checkAuthentication,fetchCardActivity)

router.patch("/:cardId",checkAuthentication,updateCard)

router.patch("/:cardId/isCompleted",checkAuthentication,updateCardStatus) 

router.patch("/:cardId/attachments",checkAuthentication,addAttachment)

router.patch("/:cardId/update/attachment",checkAuthentication,updateAttachment)

router.patch("/:cardId/delete/attachment", checkAuthentication,deleteAttachment);
  


export default router

