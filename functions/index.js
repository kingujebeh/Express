// functions/index.js
import path from "path";
import { Storage } from "@google-cloud/storage";

import { softwares } from "../data/index.js";

export function getSubname(host) {
  return Object.keys(softwares).find((key) => softwares[key].includes(host));
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

export function getFile(subname = "the-great-unknown", reqPath = "/") {
  const cleaned = sanitizePath(decodeURIComponent(reqPath));
  const hasExt = path.extname(cleaned) !== "";
  const filePath = hasExt ? cleaned : "index.html";

  return bucket.file(path.join("clients", subname, filePath));
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const emailToUsername = (email) => "";
