import { Router } from "express";
import gamesRouters from "./games.routers.js";
import customersRouters from "./customers.routers.js";
import rentalsRouters from "./rentals.routers.js";

const router = Router();

router.use(gamesRouters);
router.use(customersRouters);
router.use(rentalsRouters);

export default router;