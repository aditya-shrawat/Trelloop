
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { createBoard } from '../controllers/board.js';

const router = express.Router();


router.post("/new",checkAuthentication,createBoard);


export default router;

