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
  error: null | string,
  loading: boolean
}