import express from 'express'
import checkAuthentication from '../middlewares/authentication.js'
import { fetchCardActivity, fetchCardData, updateCard, updateCardStatus } from '../controllers/card.js';
import Card from '../models/card.js';


const router = express.Router()


router.get("/:cardId",checkAuthentication,fetchCardData)

router.get("/activities/:cardId",checkAuthentication,fetchCardActivity)

router.patch("/:cardId",checkAuthentication,updateCard)

router.patch("/:cardId/isCompleted",checkAuthentication,updateCardStatus) 



export default router

