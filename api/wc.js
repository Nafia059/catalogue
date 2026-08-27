const WC_API = "https://coresportswears.com/wp-json/wc/store/v1";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { endpoint, ...params } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: "endpoint query param required" });
  }

  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    searchParams.set(key, String(val));
  }

  try {
    const url = `${WC_API}/${endpoint}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: "failed to fetch from WooCommerce" });
  }
}
