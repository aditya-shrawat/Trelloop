import express from 'express'
import {checkAuthentication} from '../middlewares/authentication.js';
import { deleteComment, editCommentContent } from '../controllers/comment.js';

const route = express.Router();

route.delete('/:commentId/delete',checkAuthentication,deleteComment);
route.post('/:commentId/edit-content',checkAuthentication,editCommentContent);


export default route ;
