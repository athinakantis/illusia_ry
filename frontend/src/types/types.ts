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
  loading: boolean
}

export interface ApiResponse<T> {
  data: T;
  error?: string | Error;
  message: string;
}

export interface ItemAndQuantity {
  itemToBook: Item,
  quantityToBook: number,
}

export interface BookingState {
  booking: ItemAndQuantity[];
}
  
export interface FormData {
  item_name: string;
  description: string;
  category_id: string; // Assuming this holds the ID, maybe from a select input
  location: string;
  quantity: number;
  // Add other relevant fields from your 'items' table if needed
}