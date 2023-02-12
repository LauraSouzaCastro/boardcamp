import { Router } from "express";
import { postRentals, getRentals, postRentalsReturn, deleteRentals } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schemas.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalsSchema), postRentals);
router.post("/rentals/:id/return", postRentalsReturn);
router.delete("/rentals/:id", deleteRentals);

export default router;