const { loadAllSecrets } = require("../secrets");

const init = async () => {
  console.info("Initializing Express");
  await loadAllSecrets();

};

module.exports = { init };
