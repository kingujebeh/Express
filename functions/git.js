const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const { getSecret } = require("../secrets");

const mime = require("mime-types");

const bucketName = "supercpanel";

const bucket = new Storage().bucket(bucketName);

async function uploadRepoDist(gitURL) {
  const [_, __, ___, owner, repo] = gitURL.split("/");

  const token = await getSecret("GIT_TOKEN");
  console.log("Token:", token);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    // Step 1: Get default branch
    const repoRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    const defaultBranch = repoRes.data.default_branch;

    // Step 2: Get latest commit
    const branchRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits/${defaultBranch}`,
      { headers }
    );
    const commit = branchRes.data.sha;
    const timestamp = new Date(branchRes.data.commit.committer.date)
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    // Step 3: Check current version in storage
    const infoURL = `https://storage.googleapis.com/${bucketName}/u/unknown/default/dist/info.json`;
    const current = await getCurrentClientStorageInfo(infoURL);

    const needsUpdate =
      !current.commit ||
      !current.timestamp ||
      current.commit !== commit ||
      current.timestamp !== timestamp;

    if (!needsUpdate) {
      console.log(`ℹ️ No update needed`);
      return;
    }

    // Step 4: Get dist folder contents
    const treeRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${commit}?recursive=1`,
      { headers }
    );

    const distFiles = treeRes.data.tree.filter(
      (item) => item.path.startsWith("dist/") && item.type === "blob"
    );

    if (distFiles.length === 0) {
      console.warn(`⚠️ No dist folder found in latest commit of ${repo}`);
      return;
    }

    // Step 5: Download each file using GitHub API (works for private repos)
    for (const file of distFiles) {
      const contentRes = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${commit}`,
        { headers }
      );

      const filePath = `u/unknown/default/dist/${file.path.replace(
        /^dist\//,
        ""
      )}`;
      const remoteFile = bucket.file(filePath);

      const fileBuffer = Buffer.from(contentRes.data.content, "base64");
      const contentType = mime.lookup(file.path) || "application/octet-stream";

      console.log(`📤 Uploading ${filePath}`);
      await remoteFile.save(fileBuffer, {
        metadata: { contentType },
      });
    }

    // Step 6: Upload info.json
    const info = JSON.stringify({ commit, timestamp }, null, 2);
    const infoPath = `u/unknown"/default/dist/info.json`;
    const infoFile = bucket.file(infoPath);

    await infoFile.save(Buffer.from(info), {
      metadata: { contentType: "application/json" },
    });

    console.log(`✅ Uploaded dist folder for commit (${commit})`);
  } catch (error) {
    console.error(
      `❌ Error processing:`,
      error.response?.data || error.message
    );
  }
}

async function getCurrentClientStorageInfo(infoURL) {
  try {
    const res = await axios.get(infoURL, { responseType: "json" });
    const { commit, timestamp } = res.data || {};
    return {
      commit: commit || "",
      timestamp: timestamp || "",
    };
  } catch (err) {
    console.warn(`⚠️ Could not fetch info.json at ${infoURL}:`, err.message);
    return { commit: "", timestamp: "" };
  }
}

module.exports = { uploadRepoDist };
