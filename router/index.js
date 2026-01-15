// router/index.js
import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

// Routes
router.use("/auth", authRouter);

export default router;
