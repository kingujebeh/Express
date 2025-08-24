const express = require("express");
const router = express.Router();

const controller = require("../controller");

router.get("/data", controller.data);

// User
router.get("/user", (req, res) => {});


module.exports = router;
