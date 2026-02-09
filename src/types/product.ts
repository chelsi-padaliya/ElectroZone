export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  offerPrice?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
