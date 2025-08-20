
const express = require("express");
const router = express.Router();

const controller = require("../controller");


router.get("/", controller.home);

router.get("/data", controller.data);

module.exports = router;
