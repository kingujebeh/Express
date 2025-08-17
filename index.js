const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const router = require("./router");

const app = express();

app.use(cors());
app.use(morgan("common"));

app.use(router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Unknown Server Running", PORT);
});
