// router/index.js
import express from "express";
import authRouter from "./auth/index.js";

import { data } from "../controller/index.js";

const router = express.Router();

// Auth
router.use("/auth", authRouter);

// Data
router.get("/data/:app", data.appData);

export default router;
