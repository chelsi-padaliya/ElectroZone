import type { OrderItem } from "./cart";

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt?: string;
  updatedAt?: string;
}
