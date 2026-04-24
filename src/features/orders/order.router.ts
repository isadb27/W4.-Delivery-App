import { Router } from "express";
import { createOrderController, getOrdersController, acceptOrderController, updatePositionController } from "./order.controller";

const router = Router();

router.post("/", createOrderController);
router.get("/", getOrdersController);

// segundo lab
router.patch("/:id/accept", acceptOrderController);
router.patch("/:id/position", updatePositionController);

export { router };