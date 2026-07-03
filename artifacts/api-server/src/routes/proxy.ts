import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/img-proxy", async (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ error: "url query param required" });
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: "upstream fetch failed" });
      return;
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

export default router;
