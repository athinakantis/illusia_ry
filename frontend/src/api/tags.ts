import { ApiResponse, ItemState } from '../types/types';
import { api } from './axios';

export const tagsApi = {
  getAllTags: (): Promise<ApiResponse<ItemState['tags']>> => api.get('items/tags'),

  getAllItemTags: (): Promise<ApiResponse<ItemState['item_tags']>> => api.get('items/item_tags'),

  findByItem: (itemId: string): Promise<ApiResponse<ItemState['tags']>> => api.get(`items/${itemId}/tags`),
}