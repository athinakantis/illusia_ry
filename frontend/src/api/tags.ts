import { ApiResponse, ItemState } from '../types/types';
import { api } from './axios';

export const tagsApi = {
  getAllTags: (): Promise<ApiResponse<ItemState['tags']>> => api.get('items/tags')
}