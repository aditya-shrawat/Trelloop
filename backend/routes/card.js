import express from 'express'
import checkAuthentication from '../middlewares/authentication.js'
import { fetchCardActivity, fetchCardData, updateCard } from '../controllers/card.js';


const router = express.Router()


router.get("/:cardId",checkAuthentication,fetchCardData)

router.get("/activities/:cardId",checkAuthentication,fetchCardActivity)

router.patch("/:cardId",checkAuthentication,updateCard)



export default router

