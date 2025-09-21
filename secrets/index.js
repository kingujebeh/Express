// secrets.js
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
const projectId = process.env.GOOGLE_CLOUD_PROJECT || "great-unknown";

const secrets = {}; // cache for secrets

async function loadSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${name}/versions/latest`,
  });
  secrets[name] = version.payload.data.toString();
}

async function loadAllSecrets() {
  // Add all your secret names here
  const secretNames = [
    "JWT_SECRET",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_REDIRECT_URI"
  ];

  await Promise.all(secretNames.map(loadSecret));

  console.log("✅ Secrets loaded:", Object.keys(secrets).join(", "));
}

function getSecret(name) {
  return secrets[name];
}

module.exports = { loadAllSecrets, getSecret };
