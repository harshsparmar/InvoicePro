import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer
} from "../controllers/customerController.js";

const router = Router();

router.route("/").post(createCustomer).get(getCustomers);
router.route("/:id").put(updateCustomer).delete(deleteCustomer);

export default router;

