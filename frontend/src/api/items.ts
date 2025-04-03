import { Item } from '../types/types';
import { api } from './axios';

export const itemsApi = {
    getAllItems: (): Promise<Record<'data', Item[]>> =>
        api.get('items',
            {headers: {'Access-Control-Allow-Origin': '*'}}

        ),

    createItem: (item: Partial<Item>) => {
        api.post(`items`, item)
    }
};