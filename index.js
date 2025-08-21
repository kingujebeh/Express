const express = require("express");

const middlewares = require("./middlewares");
const router = require("./router");

const app = express();


app.set("trust proxy", true);


app.use(middlewares)
app.use(router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Unknown Server Running", PORT);
});
