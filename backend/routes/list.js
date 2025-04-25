
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { fetchAllLists } from '../controllers/list.js';
import { creatingNewCard, fetchListCards } from '../controllers/card.js';

const router = express.Router();
router.get("/board/:id",checkAuthentication,fetchAllLists)

router.post("/:listId/newCard",checkAuthentication,creatingNewCard)

router.get("/:listId/cards",checkAuthentication,fetchListCards)


export default router;

