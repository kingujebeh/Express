const express = require("express");
const router = express.Router();

router.get("/data", (req, res) => {
    res.json({
        name: "Unknown",
        body: {
            worlds: [],
            kingdoms: [],
            nations: []
        }

    });
});


module.exports = router;
