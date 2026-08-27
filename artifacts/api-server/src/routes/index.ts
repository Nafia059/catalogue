import { Router, type IRouter } from "express";
import healthRouter from "./health";
import proxyRouter from "./proxy";
import wcRouter from "./wc";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

router.use(healthRouter);
router.use(proxyRouter);
router.use(wcRouter);

export default router;
