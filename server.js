import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const WC_API = "https://coresportswears.com/wp-json/wc/store/v1";

app.use(cors());
app.use(express.json());

// WooCommerce API proxy
app.get("/api/wc", async (req, res) => {
  const endpoint = req.query.endpoint;
  if (!endpoint) {
    return res.status(400).json({ error: "endpoint query param required" });
  }
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(req.query)) {
    if (key !== "endpoint") params.set(key, String(val));
  }
  try {
    const url = `${WC_API}/${endpoint}${params.toString() ? "?" + params.toString() : ""}`;
    const response = await fetch(url);
    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cache-Control", "public, max-age=300");
    res.json(data);
  } catch {
    res.status(502).json({ error: "failed to fetch from WooCommerce" });
  }
});

// Image proxy
app.get("/api/img-proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "url query param required" });
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "upstream fetch failed" });
    }
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buffer));
  } catch {
    res.status(502).json({ error: "failed to fetch image" });
  }
});

// Health check
app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from artifacts/static-site/public
const staticDir = path.join(__dirname, "artifacts", "static-site", "public");
app.use(express.static(staticDir));

// Serve index.html at root
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "artifacts", "static-site", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
