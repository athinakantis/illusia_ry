import { ApiResponse, ItemState } from '../types/types';
import { api } from './axios';

export const categoriesApi = {
  getAllCategories: (): Promise<ApiResponse<ItemState['categories']>> => api.get('items/categories')
}