if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const init = async () => {
  console.info("Initializing Express");
};

module.exports = { init };
