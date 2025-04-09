import { ApiResponse, Item } from '../types/types';
import { api } from './axios';

export const itemsApi = {
    getAllItems: (): Promise<ApiResponse<Item[]>> =>
        api.get('items',
            {headers: {'Access-Control-Allow-Origin': '*'}}
        ),
        
    getItembyId: (id: string): Promise<ApiResponse<Item>> =>{
        return api.get(`/items/${id}`)
    },
    
    createItem: (item: Partial<Item>) => {
        api.post(`items`, item)
    },
    
    updateItem: (id: string, updatedItem: Partial<Item>) => {
       return api.patch(`/items/${id}`, updatedItem)
    },

    deleteItem: (id: string) => {
        return api.delete(`/items/${id}`)
    }
};