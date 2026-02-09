export interface CartItem {
  productId: string;
  name: string;
  price: number;
  offerPrice?: number;
  quantity: number;
  image?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
