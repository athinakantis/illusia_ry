import { TablesInsert } from '../types/supabase.types';
import { ApiResponse, Item } from '../types/types';
import { api } from './axios';

export type CreateItemPayload = Omit<TablesInsert<'items'>, 'item_id' | 'created_at' | 'user_id'> & { image_path?: string | null };

export const itemsApi = {
    getAllItems: (): Promise<ApiResponse<Item[]>> =>
        api.get('items',
            {headers: {'Access-Control-Allow-Origin': '*'}}
        ),
        
    getItembyId: (id: string): Promise<ApiResponse<Item>> =>{
        return api.get(`/items/${id}`)
    },
    createItem: (newItem: CreateItemPayload): Promise<ApiResponse<Item>> => {
        return api.post('/items', newItem)
    },
    
    updateItem: (id: string, updatedItem: Partial<Item>) => {
       return api.patch(`/items/${id}`, updatedItem)
    },

    deleteItem: (id: string) => {
        return api.delete(`/items/${id}`)
    }
};

