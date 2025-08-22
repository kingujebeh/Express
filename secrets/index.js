const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

let secret = null;

async function getSecret(secretName) {
  if (!secret) {
    const [version] = await client.accessSecretVersion({
      name: `projects/28739726663/secrets/${secretName}/versions/latest`,
    });
    secret = version.payload.data.toString("utf8");

    return secret;
  }
  return secret;
}

// Secrets Are Being Queried For Fix This Later!!!!

module.exports = { getSecret };
