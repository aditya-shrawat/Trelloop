import express from 'express';
import { countUnreadNotification, fetchNotifications, markAsRead } from '../controllers/notification.js';
import { checkAuthentication } from '../middlewares/authentication.js';

const router = express.Router();

router.get("/",checkAuthentication,fetchNotifications)
router.get("/count",checkAuthentication,countUnreadNotification);
router.post('/:notificationId/read',checkAuthentication,markAsRead)


export default router;

