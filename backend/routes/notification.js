
import express from 'express';
import checkAuthentication from '../middlewares/authentication.js';
import { countUnreadNotification, fetchNotifications, markAsRead } from '../controllers/notification.js';

const router = express.Router();

router.get("/",checkAuthentication,fetchNotifications)
router.get("/count",checkAuthentication,countUnreadNotification);
router.post('/:notificationId/read',checkAuthentication,markAsRead)


export default router;

