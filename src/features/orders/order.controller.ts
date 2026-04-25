import { Request, Response } from "express";
import { createOrder, getOrders, acceptOrder, updatePosition } from "./order.service";

// crear orden
export const createOrderController = async (req: Request, res: Response) => {
  try {

    const { items, total, lat, lng } = req.body;

    console.log("📦 BODY:", req.body)

    if (!items || !total) {
      return res.status(400).json({ error: "Items y total son requeridos" });
    }

    const order = await createOrder(items, total, lat, lng);

    res.json(order);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✔ obtener órdenes
export const getOrdersController = async (req: Request, res: Response) => {
  try {

    const orders = await getOrders();

    res.json(orders);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✔ aceptar orden (PATCH)
export const acceptOrderController = async (req: Request, res: Response) => {
  try {

    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const order = await acceptOrder(id);

    res.json(order);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✔ actualizar posición (PATCH)
export const updatePositionController = async (req: Request, res: Response) => {
  try {

    const id = req.params.id as string;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Lat y Lng requeridos" });
    }

    const order = await updatePosition(id, lat, lng);

    res.json(order);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};