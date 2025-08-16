const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.json({
    name: "Unknown",
    body: {
      worlds: [],
      kingdoms: [],
      nations: []
    }

  });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log("Unknown Server Running");
});
