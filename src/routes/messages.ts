import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { sendMessage, getMessages } from "../controllers/messageController";

const router = Router();

router.post("/send", authenticate, sendMessage);
router.get("/", authenticate, getMessages);

export default router;
