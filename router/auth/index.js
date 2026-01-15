const express = require("express");
const router = express.Router();

const controller = require("../../controller");

router.post("/signup", controller.auth.signup);
router.post("/signin", controller.auth.signin);

module.exports = router;
