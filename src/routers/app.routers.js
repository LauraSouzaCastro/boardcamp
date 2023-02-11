import { Router } from "express";
import gamesRouters from "./games.routers.js";
import customersRouters from "./customers.routers.js";

const router = Router();

router.use(gamesRouters);
router.use(customersRouters);

export default router;