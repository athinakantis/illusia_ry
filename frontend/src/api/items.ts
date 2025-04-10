import { ApiResponse, Item } from '../types/types';
import { api } from './axios';

export const itemsApi = {
  getAllItems: (): Promise<ApiResponse<Item[]>> =>
    api.get('items', { headers: { 'Access-Control-Allow-Origin': '*' } }),

  createItem: (item: Partial<Item>) => api.post(`items`, item),
  

  updateItem: (id: string, updatedItem: Partial<Item>) => {
    api.patch(`/items/${id}`, updatedItem);
  },

  deleteItem: (id: string) => {
    api.delete(`/items/${id}`);
  },
};
