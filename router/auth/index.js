// router/auth.js
import express from "express";
import { auth } from "../../controller/index.js";

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);

export default router;
