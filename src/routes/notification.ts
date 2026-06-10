import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getUnreadCount,
  markAllAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/unread-count", authenticate, getUnreadCount);
router.patch("/read-all", authenticate, markAllAsRead);

export default router;
