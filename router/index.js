const express = require("express");
const router = express.Router();

const controller = require("../controller");

router.get("/data", controller.data);

router.all("/{*any}", controller.home);

module.exports = router;
