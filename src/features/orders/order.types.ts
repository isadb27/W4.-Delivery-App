export type OrderItem = {
  id: number;
  name: string;
  price: number;
};

export type Order = {
  id: number;
  items: OrderItem[];
  total: number;
};