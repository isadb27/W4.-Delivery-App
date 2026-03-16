import { Router } from "express";
import { createOrderController, getOrdersController } from "./order.controller";

export const router = Router();

router.post("/", createOrderController);
router.get("/", getOrdersController);