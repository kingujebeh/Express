// core/middleware/domains.js
import path from "path";
import { fileURLToPath } from "url";
import { domains } from "../data/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Middleware to serve default client for unknown domains
 */
const serveClientFallback = (req, res, next) => {
  // Extract the hostname
  const host = req.hostname;

  // Check if host matches any known domain
  const isKnownDomain = Object.values(domains).some((domainList) =>
    domainList.includes(host)
  );

  if (isKnownDomain) {
    return next(); // continue to other routes
  }

  // Serve the default client/dist index.html
  const clientIndex = path.join(__dirname, "../client/dist/index.html");
  res.sendFile(clientIndex, (err) => {
    if (err) next(err);
  });
};

export default serveClientFallback;
