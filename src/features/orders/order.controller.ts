import { Request, Response } from "express";
import { createOrder, getOrders } from "./order.service";

export const createOrderController = async (req: Request, res: Response) => {

  const { items, total } = req.body;

  const order = await createOrder(items, total);

  res.status(201).json(order);

};

export const getOrdersController = async (req: Request, res: Response) => {

  const orders = await getOrders();

  res.json(orders);

};