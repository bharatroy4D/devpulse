import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.post('/signUp', authController.signUp)

export const route = router;