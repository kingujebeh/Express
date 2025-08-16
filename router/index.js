const express = require("express");
const router = express.Router();

router.get("/data", (req, res) => {
  res.json({
    name: "Unknown",
    body: {
      worlds: [
        {
          id: "biological",
          list: [],
        },
        {
          id: "basic",
          types: [],
        },
        {
          id: "planetry",
          list: [],
        },
      ],
      kingdoms: [
        { id: "large", list: [{ id: "africa" }, { id: "britain" }] },
        { id: "medium", list: [{ id: "benin" }] },
        { id: "small" },
      ],
      nations: [
        { id: "nigeria", name: "Nigeria" },
        { id: "igbo", name: "Ibo" },
        { id: "yoruba", name: "Yoruba" },
        { id: "hausa", name: "Hausa" },
      ],
      countries: [
        { id: "small" },
        { id: "medium", list: [{ id: "nigeria" }] },
        { id: "large" },
      ],
      populations: [
        { id: "small" },
        { id: "medium" },
        { id: "large", list: [{ id: "nigeria" }] },
      ],
    },
  });
});

module.exports = router;
