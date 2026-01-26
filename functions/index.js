// functions/index.js
import path from "path";
import { Storage } from "@google-cloud/storage";

import { clients } from "../data/index.js";

export function getSubname(host) {
  const client = clients.find((c) => c.hosts.includes(host));
  return client ? client.package : null;
}

const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
  projectId: "great-unknown",
});

const bucket = storage.bucket("great-unknown.appspot.com");

export function sanitizePath(p) {
  return p
    .split("?")[0] // remove query string
    .replace(/^\/+/, "") // remove leading slashes
    .replace(/\.\./g, ""); // prevent directory traversal
}

export function getFile(client = "the-great-unknown", reqPath = "/") {
  const cleaned = sanitizePath(decodeURIComponent(reqPath));
  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : "index.html";

  return bucket.file(path.join("clients", client, filePath));
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
