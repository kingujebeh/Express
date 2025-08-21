const fn = require("../functions");

const commit = async (req, res) => {
  const gitURL = req.body.repository.html_url;

  console.info("Updating From Repo: " + gitURL);

  fn.uploadRepoDist(gitURL);
  res.send(true);
};

module.exports = { commit };
