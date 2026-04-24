import { Request, Response } from "express";
import { createOrder, getOrders, acceptOrder, updatePosition } from "./order.service";

// crear orden
export const createOrderController = async (req: Request, res: Response) => {
  const { items, total } = req.body;
  const order = await createOrder(items, total);
  res.json(order);
};

// obtener órdenes
export const getOrdersController = async (req: Request, res: Response) => {
  const orders = await getOrders();
  res.json(orders);
};

// aceptar orden (PATCH)
export const acceptOrderController = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const order = await acceptOrder(id);

  res.json(order);
};

// actualizar posición (PATCH)
export const updatePositionController = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { lat, lng } = req.body;

  const order = await updatePosition(id, lat, lng);

  res.json(order);
};