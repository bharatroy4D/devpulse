import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.post('/signUp', authController.signUp);
router.post('/login', authController.login)
router.post('/',)

export const route = router;