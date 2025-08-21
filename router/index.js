const express = require("express");
const router = express.Router();

const controller = require("../controller");

router.get("/data", controller.data);

// User
router.get("/user", (req, res) => {});

// Git Commits
router.post("/commit", controller.commit);

router.all("/{*any}", controller.home);

module.exports = router;
