import { ApiResponse, ItemState } from '../types/types';
import { api } from './axios';

export const categoriesApi = {
  getAllCategories: (): Promise<ApiResponse<ItemState['categories']>> => api.get('items/categories'),

  createCategory: (categoryData: { category_name: string; image_path?: string }): Promise<ApiResponse<ItemState['categories']>> => api.post('categories', categoryData),

  updateCategory: (categoryId: string, categoryData: { category_name: string; image_path?: string }): Promise<ApiResponse<ItemState['categories']>> => api.put(`categories/${categoryId}`, categoryData),

  deleteCategory: (categoryId: string): Promise<ApiResponse<ItemState['categories']>> => api.delete(`categories/${categoryId}`),

  assignItemToCategory: (itemId: string, categoryId: string): Promise<ApiResponse<ItemState['categories']>> => api.post(`categories/items/${itemId}/${categoryId}`),

  removeItemCategory: (itemId: string): Promise<ApiResponse<ItemState['categories']>> => api.patch(`categories/items/${itemId}`),
}