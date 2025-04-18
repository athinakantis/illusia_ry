export interface Item {
  item_id: string,
  category_id: string,
  item_name: string,
  description?: string,
  image_path: string,
  location: string,
  quantity: number,
  created_at: string
}

export interface ItemState {
  items: Item[],
  item: Item | null,
  error: null | string,
  loading: boolean,
  categories: {
    category_id: string,
    category_name: string,
    image_path: string
  }[]
}
export interface ApiResponse<T> {
  data: T;
  error?: string | Error;
  message: string;
}

export interface ItemAndQuantity {
  itemInCart: Item,
  quantityOfItem: number,
}

export interface CartState {
  cart: ItemAndQuantity[];
}

export interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  // Add other relevant fields from your 'items' table if needed
}