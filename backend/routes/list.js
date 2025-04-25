
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { fetchAllLists } from '../controllers/list.js';

const router = express.Router();
router.get("/board/:id",checkAuthentication,fetchAllLists)


export default router;

