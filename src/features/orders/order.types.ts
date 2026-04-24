export type OrderItem = {
  id: number;
  name: string;
  price: number;
};

export enum OrderStatus {
  CREATED = "Creado",
  IN_DELIVERY = "En entrega",
  DELIVERED = "Entregado",
}

export type Order = {
  id: number;
  items: OrderItem[];
  total: number;

  // nuevos campos del lab
  status: OrderStatus;

  delivery_position?: {
    lat: number;
    lng: number;
  };

  destination?: {
    lat: number;
    lng: number;
  };
};