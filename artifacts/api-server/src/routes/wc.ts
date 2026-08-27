import { Router, type IRouter } from "express";

const router: IRouter = Router();

const WC_API = "https://coresportswears.com/wp-json/wc/store/v1";

router.get("/wc", async (req, res) => {
  const endpoint = req.query.endpoint as string;
  if (!endpoint) {
    res.status(400).json({ error: "endpoint query param required" });
    return;
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

export default router;
