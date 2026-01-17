// router/index.js
import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

// Auth
router.use("/auth", authRouter);

router.get("/graphql", (req, res) => {
  res.send("graphql");
});

export default router;
