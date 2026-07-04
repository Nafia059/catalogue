import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the static-site
const staticPaths = [
  path.resolve(import.meta.dirname, "..", "..", "static-site", "public"),
  path.resolve(import.meta.dirname, "..", "..", "static-site", "dist", "public"),
];
let staticDir = "";
for (const p of staticPaths) {
  if (fs.existsSync(p)) {
    staticDir = p;
    app.use(express.static(p));
    logger.info({ path: p }, "Serving static files");
    break;
  }
}

app.use("/api", router);

// SPA fallback — serve index.html for non-file routes (but not .html files)
if (staticDir) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    if (fs.existsSync(path.join(staticDir, req.path))) return next();
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
