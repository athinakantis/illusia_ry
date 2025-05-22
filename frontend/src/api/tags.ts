import { ApiResponse, ItemState } from '../types/types';
import { api } from './axios';

export const tagsApi = {
  getAllTags: (): Promise<ApiResponse<ItemState['tags']>> => api.get('items/tags'),

  getAllItemTags: (): Promise<ApiResponse<ItemState['item_tags']>> => api.get('items/item_tags'),

  findByItem: (itemId: string): Promise<ApiResponse<ItemState['tags']>> => api.get(`items/${itemId}/tags`),

  createTag: (tagData: { tag_name: string; description?: string }): Promise<ApiResponse<ItemState['tags']>> => api.post('/tags', tagData),

  deleteTag: (tagId: string): Promise<ApiResponse<ItemState['tags']>> => api.delete(`tags/${tagId}`),

  updateTag: (tagId: string, tagData: { tag_name: string; description?: string }): Promise<ApiResponse<ItemState['tags']>> => api.put(`tags/${tagId}`, tagData),

  addTagToItem: (itemId: string, tagId: string): Promise<ApiResponse<ItemState['item_tags']>> => api.post(`tags/items/${itemId}/${tagId}`),

  removeTagFromItem: (itemId: string, tagId: string): Promise<ApiResponse<ItemState['item_tags']>> => api.delete(`tags/items/${itemId}/${tagId}`),
}