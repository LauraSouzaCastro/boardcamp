import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, putCustomers } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customersSchema } from "../schemas/customers.schemas.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", validateSchema(customersSchema), postCustomers);
router.put("/customers/:id", validateSchema(customersSchema), putCustomers);

export default router;