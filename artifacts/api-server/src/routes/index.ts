import { Router, type IRouter } from "express";
import healthRouter from "./health";
import proxyRouter from "./proxy";
import wcRouter from "./wc";

const router: IRouter = Router();

router.use(healthRouter);
router.use(proxyRouter);
router.use(wcRouter);

export default router;
