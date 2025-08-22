const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

async function getSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: `projects/28739726663/secrets/${secretName}/versions/latest`,
  });

  return version.payload.data.toString("utf8");
}

// Secrets Are Being Queried For Fix This Later!!!!

module.exports = { getSecret };
