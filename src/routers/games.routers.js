import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/games.schemas.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", validateSchema(gameSchema), postGames);

export default router;