import { Router } from "express";

import {
  healthCheck,
  liveCheck,
  readyCheck,
} from "../controllers/healthController";

const router = Router();

router.get("/", healthCheck);
router.get("/live", liveCheck);
router.get("/ready", readyCheck);

export default router;